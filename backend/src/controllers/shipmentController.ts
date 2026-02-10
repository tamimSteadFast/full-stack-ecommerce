import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { shipments, orders } from '../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const createShipmentSchema = z.object({
  body: z.object({
    orderId: z.number().int(),
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().min(1),
    trackingNumber: z.string().optional(),
  }),
});

export const updateShipmentSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'SHIPPED', 'DELIVERED', 'RETURNED']).optional(),
    trackingNumber: z.string().optional(),
  }),
});

export const getShipment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = parseInt(req.params.orderId as string);
    const shipment = await db.query.shipments.findFirst({
      where: eq(shipments.orderId, orderId),
    });
    
    if (!shipment) {
      res.status(404).json({ message: 'Shipment not found' });
      return;
    }
    
    res.json(shipment);
  } catch (error) {
    next(error);
  }
};

export const createShipment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, address, city, postalCode, country, phone, trackingNumber } = req.body;

    // Check if shipment already exists
    const existing = await db.query.shipments.findFirst({
        where: eq(shipments.orderId, orderId)
    });

    if (existing) {
        // Update existing placeholder
        await db.update(shipments).set({
            address, city, postalCode, country, phone, trackingNumber, status: 'PENDING'
        }).where(eq(shipments.id, existing.id));
    } else {
        await db.insert(shipments).values({
            orderId, address, city, postalCode, country, phone, trackingNumber, status: 'PENDING'
        });
    }

    res.status(201).json({ message: 'Shipment created' });
  } catch (error) {
    next(error);
  }
};

export const updateShipment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    const { status, trackingNumber } = req.body;

    await db.update(shipments).set({
        status,
        trackingNumber
    }).where(eq(shipments.id, id));

    if (status === 'SHIPPED') {
        // Update order status
        const shipment = await db.query.shipments.findFirst({ where: eq(shipments.id, id) });
        if (shipment) {
            await db.update(orders).set({ status: 'SHIPPED' }).where(eq(orders.id, shipment.orderId));
        }
    }
    
    if (status === 'DELIVERED') {
         const shipment = await db.query.shipments.findFirst({ where: eq(shipments.id, id) });
         if (shipment) {
             await db.update(orders).set({ status: 'DELIVERED' }).where(eq(orders.id, shipment.orderId));
         }
    }

    res.json({ message: 'Shipment updated' });
  } catch (error) {
    next(error);
  }
};
