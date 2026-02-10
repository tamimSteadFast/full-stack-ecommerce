import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { payments, orders } from '../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const processPaymentSchema = z.object({
  body: z.object({
    orderId: z.number().int(),
    provider: z.string().min(1),
    transactionId: z.string().min(1),
  }),
});

export const updatePaymentStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']),
  }),
});

export const processPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, provider, transactionId } = req.body;

    const order = await db.query.orders.findFirst({
        where: eq(orders.id, orderId)
    });

    if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
    }

    // Mock Payment Processing
    // Update Payment record
    const payment = await db.query.payments.findFirst({
        where: eq(payments.orderId, orderId)
    });

    if (payment) {
        await db.update(payments).set({
            status: 'COMPLETED',
            provider,
            transactionId
        }).where(eq(payments.id, payment.id));
    } else {
        // Create if missing (should exist from order creation)
        await db.insert(payments).values({
            orderId,
            amount: order.totalAmount,
            status: 'COMPLETED',
            provider,
            transactionId
        });
    }

    // Update Order Status
    await db.update(orders).set({ status: 'PAID' }).where(eq(orders.id, orderId));

    res.json({ message: 'Payment processed successfully' });
  } catch (error) {
    next(error);
  }
};

export const getPaymentDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = parseInt(req.params.orderId as string);
    const payment = await db.query.payments.findFirst({
      where: eq(payments.orderId, orderId),
    });

    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }

    res.json(payment);
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    const { status } = req.body;

    await db.update(payments).set({ status }).where(eq(payments.id, id));
    res.json({ message: 'Payment status updated' });
  } catch (error) {
    next(error);
  }
};
