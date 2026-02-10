"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentStatus = exports.getPaymentDetails = exports.processPayment = exports.updatePaymentStatusSchema = exports.processPaymentSchema = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
exports.processPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderId: zod_1.z.number().int(),
        provider: zod_1.z.string().min(1),
        transactionId: zod_1.z.string().min(1),
    }),
});
exports.updatePaymentStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']),
    }),
});
const processPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, provider, transactionId } = req.body;
        const order = yield db_1.db.query.orders.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.orders.id, orderId)
        });
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        // Mock Payment Processing
        // Update Payment record
        const payment = yield db_1.db.query.payments.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.payments.orderId, orderId)
        });
        if (payment) {
            yield db_1.db.update(schema_1.payments).set({
                status: 'COMPLETED',
                provider,
                transactionId
            }).where((0, drizzle_orm_1.eq)(schema_1.payments.id, payment.id));
        }
        else {
            // Create if missing (should exist from order creation)
            yield db_1.db.insert(schema_1.payments).values({
                orderId,
                amount: order.totalAmount,
                status: 'COMPLETED',
                provider,
                transactionId
            });
        }
        // Update Order Status
        yield db_1.db.update(schema_1.orders).set({ status: 'PAID' }).where((0, drizzle_orm_1.eq)(schema_1.orders.id, orderId));
        res.json({ message: 'Payment processed successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.processPayment = processPayment;
const getPaymentDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = parseInt(req.params.orderId);
        const payment = yield db_1.db.query.payments.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.payments.orderId, orderId),
        });
        if (!payment) {
            res.status(404).json({ message: 'Payment not found' });
            return;
        }
        res.json(payment);
    }
    catch (error) {
        next(error);
    }
});
exports.getPaymentDetails = getPaymentDetails;
const updatePaymentStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        yield db_1.db.update(schema_1.payments).set({ status }).where((0, drizzle_orm_1.eq)(schema_1.payments.id, id));
        res.json({ message: 'Payment status updated' });
    }
    catch (error) {
        next(error);
    }
});
exports.updatePaymentStatus = updatePaymentStatus;
//# sourceMappingURL=paymentController.js.map