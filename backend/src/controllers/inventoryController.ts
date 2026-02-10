import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { inventory } from '../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const updateInventorySchema = z.object({
  body: z.object({
    quantity: z.number().int().min(0),
    warehouseLocation: z.string().optional(),
  }),
});

export const checkStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const variantId = parseInt(req.params.variantId as string);
    const stock = await db.query.inventory.findFirst({
      where: eq(inventory.variantId, variantId),
    });

    if (!stock) {
      res.status(404).json({ message: 'Inventory not found for this variant' });
      return;
    }

    res.json({
      variantId,
      quantity: stock.quantity,
      available: stock.quantity > 0,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const variantId = parseInt(req.params.variantId as string);
    const { quantity, warehouseLocation } = req.body;

    const existing = await db.select().from(inventory).where(eq(inventory.variantId, variantId)).limit(1);

    if (existing.length === 0) {
        // Create if not exists
        await db.insert(inventory).values({
            variantId,
            quantity,
            warehouseLocation
        });
    } else {
        await db.update(inventory).set({
            quantity,
            warehouseLocation,
        }).where(eq(inventory.variantId, variantId));
    }

    res.json({ message: 'Inventory updated' });
  } catch (error) {
    next(error);
  }
};
