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
exports.getProductVariants = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.listProducts = exports.updateProductSchema = exports.createProductSchema = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        description: zod_1.z.string().optional(),
        brand: zod_1.z.string().optional(),
        status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
    }),
});
exports.updateProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().optional(),
        brand: zod_1.z.string().optional(),
        status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
    }),
});
const listProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search;
        const brand = req.query.brand;
        let whereClause = undefined;
        const conditions = [];
        if (search) {
            conditions.push((0, drizzle_orm_1.like)(schema_1.products.name, `%${search}%`));
        }
        if (brand) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.products.brand, brand));
        }
        // Default to active only for public? Or admin sees all? 
        // Usually public API shows ACTIVE.
        // conditions.push(eq(products.status, 'ACTIVE')); 
        if (conditions.length > 0) {
            whereClause = (0, drizzle_orm_1.and)(...conditions);
        }
        const productsList = yield db_1.db.select().from(schema_1.products)
            .where(whereClause)
            .limit(limit)
            .offset(offset)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.products.createdAt));
        const totalCountResult = yield db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.products).where(whereClause);
        const total = totalCountResult[0].count;
        res.json({
            data: productsList,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.listProducts = listProducts;
const getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const product = yield db_1.db.query.products.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.products.id, id),
            with: {
                variants: {
                    with: {
                        prices: true,
                        inventory: true
                    }
                }
            }
        });
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json(product);
    }
    catch (error) {
        next(error);
    }
});
exports.getProduct = getProduct;
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, brand, status } = req.body;
        const [result] = yield db_1.db.insert(schema_1.products).values({
            name,
            description,
            brand,
            status,
        });
        const insertId = result.insertId;
        res.status(201).json({ id: insertId, message: 'Product created' });
    }
    catch (error) {
        next(error);
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { name, description, brand, status } = req.body;
        yield db_1.db.update(schema_1.products).set({
            name,
            description,
            brand,
            status,
        }).where((0, drizzle_orm_1.eq)(schema_1.products.id, id));
        res.json({ message: 'Product updated' });
    }
    catch (error) {
        next(error);
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        yield db_1.db.delete(schema_1.products).where((0, drizzle_orm_1.eq)(schema_1.products.id, id));
        res.json({ message: 'Product deleted' });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProduct = deleteProduct;
const getProductVariants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.id);
        const variants = yield db_1.db.query.productVariants.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.productVariants.productId, productId),
            with: {
                prices: true,
                inventory: true
            }
        });
        res.json(variants);
    }
    catch (error) {
        next(error);
    }
});
exports.getProductVariants = getProductVariants;
//# sourceMappingURL=productController.js.map