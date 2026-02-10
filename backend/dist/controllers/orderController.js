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
exports.updateOrderStatus = exports.getOrder = exports.getOrders = exports.createOrder = exports.updateOrderStatusSchema = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
exports.updateOrderStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
    }),
});
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return;
        // 1. Get Cart
        const cart = yield db_1.db.query.carts.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.carts.userId, req.user.id),
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
        yield db_1.db.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
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
                    var _a, _b;
                    // Sort by validFrom desc
                    return (((_a = b.validFrom) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) - (((_b = a.validFrom) === null || _b === void 0 ? void 0 : _b.getTime()) || 0);
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
                yield tx.update(schema_1.inventory)
                    .set({ quantity: stock.quantity - item.quantity })
                    .where((0, drizzle_orm_1.eq)(schema_1.inventory.id, stock.id));
            }
            // 5. Create Order
            const [orderResult] = yield tx.insert(schema_1.orders).values({
                userId: req.user.id,
                totalAmount: totalAmount.toFixed(2),
                status: 'PENDING',
            });
            const orderId = orderResult.insertId;
            // 6. Create Order Items
            for (const itemData of orderItemsData) {
                yield tx.insert(schema_1.orderItems).values({
                    orderId,
                    variantId: itemData.variantId,
                    quantity: itemData.quantity,
                    price: itemData.price,
                });
            }
            // 7. Clear Cart
            yield tx.delete(schema_1.cartItems).where((0, drizzle_orm_1.eq)(schema_1.cartItems.cartId, cart.id));
            // 8. Create Payment Placeholder
            yield tx.insert(schema_1.payments).values({
                orderId,
                amount: totalAmount.toFixed(2),
                status: 'PENDING'
            });
            // 9. Create Shipment Placeholder (Optional, maybe address is needed in createOrder body)
            // Assuming user has address or passes it. For now, placeholder.
            yield tx.insert(schema_1.shipments).values({
                orderId,
                address: "TBD", // Should come from req.body
                city: "TBD",
                postalCode: "TBD",
                country: "TBD",
                phone: "TBD"
            });
            res.status(201).json({ message: 'Order created', orderId });
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.createOrder = createOrder;
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return;
        const userOrders = yield db_1.db.query.orders.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.orders.userId, req.user.id),
            orderBy: [(0, drizzle_orm_1.desc)(schema_1.orders.createdAt)],
            with: {
                items: true,
                payment: true,
                shipment: true
            }
        });
        res.json(userOrders);
    }
    catch (error) {
        next(error);
    }
});
exports.getOrders = getOrders;
const getOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return;
        const id = parseInt(req.params.id);
        const order = yield db_1.db.query.orders.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.orders.id, id),
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
    }
    catch (error) {
        next(error);
    }
});
exports.getOrder = getOrder;
const updateOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        yield db_1.db.update(schema_1.orders).set({ status }).where((0, drizzle_orm_1.eq)(schema_1.orders.id, id));
        res.json({ message: 'Order status updated' });
    }
    catch (error) {
        next(error);
    }
});
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=orderController.js.map