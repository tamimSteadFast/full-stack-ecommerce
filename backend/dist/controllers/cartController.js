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
exports.clearCart = exports.removeCartItem = exports.updateCartItem = exports.addToCart = exports.getCart = exports.updateCartItemSchema = exports.addToCartSchema = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
exports.addToCartSchema = zod_1.z.object({
    body: zod_1.z.object({
        variantId: zod_1.z.number().int(),
        quantity: zod_1.z.number().int().min(1).default(1),
    }),
});
exports.updateCartItemSchema = zod_1.z.object({
    body: zod_1.z.object({
        quantity: zod_1.z.number().int().min(1),
    }),
});
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return;
        let cart = yield db_1.db.query.carts.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.carts.userId, req.user.id),
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
    }
    catch (error) {
        next(error);
    }
});
exports.getCart = getCart;
const addToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return;
        const { variantId, quantity } = req.body;
        // Find or create cart
        let cart = yield db_1.db.query.carts.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.carts.userId, req.user.id),
        });
        if (!cart) {
            const [result] = yield db_1.db.insert(schema_1.carts).values({ userId: req.user.id });
            cart = { id: result.insertId, userId: req.user.id, createdAt: new Date(), updatedAt: new Date() };
        }
        // Check if item exists
        const existingItem = yield db_1.db.query.cartItems.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.cartItems.cartId, cart.id), (0, drizzle_orm_1.eq)(schema_1.cartItems.variantId, variantId)),
        });
        if (existingItem) {
            yield db_1.db.update(schema_1.cartItems)
                .set({ quantity: existingItem.quantity + quantity })
                .where((0, drizzle_orm_1.eq)(schema_1.cartItems.id, existingItem.id));
        }
        else {
            yield db_1.db.insert(schema_1.cartItems).values({
                cartId: cart.id,
                variantId,
                quantity,
            });
        }
        res.status(200).json({ message: 'Item added to cart' });
    }
    catch (error) {
        next(error);
    }
});
exports.addToCart = addToCart;
const updateCartItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return;
        const id = parseInt(req.params.id);
        const { quantity } = req.body;
        // Verify ownership indirectly or directly? 
        // Ideally we check if this item belongs to a cart owned by the user.
        // For simplicity, just update by ID, assuming ID is unique globally.
        // But secure way: join with cart and user.
        // Using simple update for now, but in production check ownership!
        // Let's do a quick check
        const item = yield db_1.db.query.cartItems.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.cartItems.id, id),
            with: {
                cart: true
            }
        });
        if (!item || item.cart.userId !== req.user.id) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        yield db_1.db.update(schema_1.cartItems).set({ quantity }).where((0, drizzle_orm_1.eq)(schema_1.cartItems.id, id));
        res.json({ message: 'Cart item updated' });
    }
    catch (error) {
        next(error);
    }
});
exports.updateCartItem = updateCartItem;
const removeCartItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return;
        const id = parseInt(req.params.id);
        const item = yield db_1.db.query.cartItems.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.cartItems.id, id),
            with: {
                cart: true
            }
        });
        if (!item || item.cart.userId !== req.user.id) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        yield db_1.db.delete(schema_1.cartItems).where((0, drizzle_orm_1.eq)(schema_1.cartItems.id, id));
        res.json({ message: 'Item removed from cart' });
    }
    catch (error) {
        next(error);
    }
});
exports.removeCartItem = removeCartItem;
const clearCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return;
        const cart = yield db_1.db.query.carts.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.carts.userId, req.user.id),
        });
        if (cart) {
            yield db_1.db.delete(schema_1.cartItems).where((0, drizzle_orm_1.eq)(schema_1.cartItems.cartId, cart.id));
        }
        res.json({ message: 'Cart cleared' });
    }
    catch (error) {
        next(error);
    }
});
exports.clearCart = clearCart;
//# sourceMappingURL=cartController.js.map