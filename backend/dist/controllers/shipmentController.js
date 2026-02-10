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
exports.updateShipment = exports.createShipment = exports.getShipment = exports.updateShipmentSchema = exports.createShipmentSchema = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
exports.createShipmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderId: zod_1.z.number().int(),
        address: zod_1.z.string().min(1),
        city: zod_1.z.string().min(1),
        postalCode: zod_1.z.string().min(1),
        country: zod_1.z.string().min(1),
        phone: zod_1.z.string().min(1),
        trackingNumber: zod_1.z.string().optional(),
    }),
});
exports.updateShipmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['PENDING', 'SHIPPED', 'DELIVERED', 'RETURNED']).optional(),
        trackingNumber: zod_1.z.string().optional(),
    }),
});
const getShipment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = parseInt(req.params.orderId);
        const shipment = yield db_1.db.query.shipments.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.shipments.orderId, orderId),
        });
        if (!shipment) {
            res.status(404).json({ message: 'Shipment not found' });
            return;
        }
        res.json(shipment);
    }
    catch (error) {
        next(error);
    }
});
exports.getShipment = getShipment;
const createShipment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, address, city, postalCode, country, phone, trackingNumber } = req.body;
        // Check if shipment already exists
        const existing = yield db_1.db.query.shipments.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.shipments.orderId, orderId)
        });
        if (existing) {
            // Update existing placeholder
            yield db_1.db.update(schema_1.shipments).set({
                address, city, postalCode, country, phone, trackingNumber, status: 'PENDING'
            }).where((0, drizzle_orm_1.eq)(schema_1.shipments.id, existing.id));
        }
        else {
            yield db_1.db.insert(schema_1.shipments).values({
                orderId, address, city, postalCode, country, phone, trackingNumber, status: 'PENDING'
            });
        }
        res.status(201).json({ message: 'Shipment created' });
    }
    catch (error) {
        next(error);
    }
});
exports.createShipment = createShipment;
const updateShipment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { status, trackingNumber } = req.body;
        yield db_1.db.update(schema_1.shipments).set({
            status,
            trackingNumber
        }).where((0, drizzle_orm_1.eq)(schema_1.shipments.id, id));
        if (status === 'SHIPPED') {
            // Update order status
            const shipment = yield db_1.db.query.shipments.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.shipments.id, id) });
            if (shipment) {
                yield db_1.db.update(schema_1.orders).set({ status: 'SHIPPED' }).where((0, drizzle_orm_1.eq)(schema_1.orders.id, shipment.orderId));
            }
        }
        if (status === 'DELIVERED') {
            const shipment = yield db_1.db.query.shipments.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.shipments.id, id) });
            if (shipment) {
                yield db_1.db.update(schema_1.orders).set({ status: 'DELIVERED' }).where((0, drizzle_orm_1.eq)(schema_1.orders.id, shipment.orderId));
            }
        }
        res.json({ message: 'Shipment updated' });
    }
    catch (error) {
        next(error);
    }
});
exports.updateShipment = updateShipment;
//# sourceMappingURL=shipmentController.js.map