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
exports.updateInventory = exports.checkStock = exports.updateInventorySchema = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
exports.updateInventorySchema = zod_1.z.object({
    body: zod_1.z.object({
        quantity: zod_1.z.number().int().min(0),
        warehouseLocation: zod_1.z.string().optional(),
    }),
});
const checkStock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const variantId = parseInt(req.params.variantId);
        const stock = yield db_1.db.query.inventory.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.inventory.variantId, variantId),
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
    }
    catch (error) {
        next(error);
    }
});
exports.checkStock = checkStock;
const updateInventory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const variantId = parseInt(req.params.variantId);
        const { quantity, warehouseLocation } = req.body;
        const existing = yield db_1.db.select().from(schema_1.inventory).where((0, drizzle_orm_1.eq)(schema_1.inventory.variantId, variantId)).limit(1);
        if (existing.length === 0) {
            // Create if not exists
            yield db_1.db.insert(schema_1.inventory).values({
                variantId,
                quantity,
                warehouseLocation
            });
        }
        else {
            yield db_1.db.update(schema_1.inventory).set({
                quantity,
                warehouseLocation,
            }).where((0, drizzle_orm_1.eq)(schema_1.inventory.variantId, variantId));
        }
        res.json({ message: 'Inventory updated' });
    }
    catch (error) {
        next(error);
    }
});
exports.updateInventory = updateInventory;
//# sourceMappingURL=inventoryController.js.map