import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { orders, orderItems, carts, cartItems, productVariants, prices, inventory, payments, shipments } from '../db/schema';
import { eq, and, desc, sql, inArray } from 'drizzle-orm';
import { z } from 'zod';

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  }),
});

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return;

    // 1. Get Cart
    const cart = await db.query.carts.findFirst({
      where: eq(carts.userId, req.user.id),
      with: {
        items: {
          with: {
            variant: {
              with: {
                prices: true, // Need to filter active price
                inventory: true
              }
            }
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    // Start Transaction
    await db.transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of cart.items) {
        // 2. Validate Inventory
        const stock = item.variant.inventory;
        if (!stock || stock.quantity < item.quantity) {
          throw new Error(`Insufficient stock for variant ${item.variant.sku}`);
        }

        // 3. Get Price (Simple logic: latest price)
        // Ideally should check validFrom/validTo
        const priceObj = item.variant.prices.sort((a, b) => {
            // Sort by validFrom desc
             return (b.validFrom?.getTime() || 0) - (a.validFrom?.getTime() || 0);
        })[0];
        
        if (!priceObj) {
            throw new Error(`Price not found for variant ${item.variant.sku}`);
        }
        
        const price = Number(priceObj.amount);
        totalAmount += price * item.quantity;

        orderItemsData.push({
          variantId: item.variantId,
          quantity: item.quantity,
          price: priceObj.amount, // Store as string/decimal from DB
        });

        // 4. Deduct Inventory
        await tx.update(inventory)
          .set({ quantity: stock.quantity - item.quantity })
          .where(eq(inventory.id, stock.id));
      }

      // 5. Create Order
      const [orderResult] = await tx.insert(orders).values({
        userId: req.user!.id,
        totalAmount: totalAmount.toFixed(2),
        status: 'PENDING',
      });

      const orderId = orderResult.insertId;

      // 6. Create Order Items
      for (const itemData of orderItemsData) {
        await tx.insert(orderItems).values({
          orderId,
          variantId: itemData.variantId,
          quantity: itemData.quantity,
          price: itemData.price,
        });
      }

      // 7. Clear Cart
      await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id));

      // 8. Create Payment Placeholder
      await tx.insert(payments).values({
          orderId,
          amount: totalAmount.toFixed(2),
          status: 'PENDING'
      });
      
      // 9. Create Shipment Placeholder (Optional, maybe address is needed in createOrder body)
      // Assuming user has address or passes it. For now, placeholder.
      await tx.insert(shipments).values({
          orderId,
          address: "TBD", // Should come from req.body
          city: "TBD",
          postalCode: "TBD",
          country: "TBD",
          phone: "TBD"
      });
      
      res.status(201).json({ message: 'Order created', orderId });
    });

  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return;
    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, req.user.id),
      orderBy: [desc(orders.createdAt)],
      with: {
        items: true,
        payment: true,
        shipment: true
      }
    });
    res.json(userOrders);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return;
    const id = parseInt(req.params.id as string);
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: {
            with: {
                variant: {
                    with: {
                        product: true
                    }
                }
            }
        },
        payment: true,
        shipment: true
      }
    });

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Check ownership or admin
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    const { status } = req.body;
    
    await db.update(orders).set({ status }).where(eq(orders.id, id));
    
    res.json({ message: 'Order status updated' });
  } catch (error) {
    next(error);
  }
};
