import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { carts, cartItems, productVariants, products, prices } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    variantId: z.number().int(),
    quantity: z.number().int().min(1).default(1),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(1),
  }),
});

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return;
    
    let cart = await db.query.carts.findFirst({
      where: eq(carts.userId, req.user.id),
      with: {
        items: {
          with: {
            variant: {
              with: {
                product: true,
                prices: true // Should filter active price? Just taking all for now.
              }
            }
          }
        }
      }
    });

    if (!cart) {
      // Return empty cart structure
      res.json({ items: [] });
      return;
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return;
    const { variantId, quantity } = req.body;

    // Find or create cart
    let cart = await db.query.carts.findFirst({
      where: eq(carts.userId, req.user.id),
    });

    if (!cart) {
      const [result] = await db.insert(carts).values({ userId: req.user.id });
      cart = { id: result.insertId, userId: req.user.id, createdAt: new Date(), updatedAt: new Date() };
    }

    // Check if item exists
    const existingItem = await db.query.cartItems.findFirst({
      where: and(eq(cartItems.cartId, cart.id), eq(cartItems.variantId, variantId)),
    });

    if (existingItem) {
      await db.update(cartItems)
        .set({ quantity: existingItem.quantity + quantity })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      await db.insert(cartItems).values({
        cartId: cart.id,
        variantId,
        quantity,
      });
    }

    res.status(200).json({ message: 'Item added to cart' });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return;
    const id = parseInt(req.params.id as string);
    const { quantity } = req.body;

    // Verify ownership indirectly or directly? 
    // Ideally we check if this item belongs to a cart owned by the user.
    // For simplicity, just update by ID, assuming ID is unique globally.
    // But secure way: join with cart and user.
    
    // Using simple update for now, but in production check ownership!
    // Let's do a quick check
    const item = await db.query.cartItems.findFirst({
        where: eq(cartItems.id, id),
        with: {
            cart: true
        }
    });

    if (!item || item.cart.userId !== req.user.id) {
        res.status(404).json({ message: 'Item not found' });
        return;
    }

    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id));
    res.json({ message: 'Cart item updated' });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return;
    const id = parseInt(req.params.id as string);

    const item = await db.query.cartItems.findFirst({
        where: eq(cartItems.id, id),
        with: {
            cart: true
        }
    });

    if (!item || item.cart.userId !== req.user.id) {
        res.status(404).json({ message: 'Item not found' });
        return;
    }

    await db.delete(cartItems).where(eq(cartItems.id, id));
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return;
    
    const cart = await db.query.carts.findFirst({
      where: eq(carts.userId, req.user.id),
    });

    if (cart) {
      await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
    }

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};
