"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderItemsRelations = exports.ordersRelations = exports.cartItemsRelations = exports.cartsRelations = exports.productVariantsRelations = exports.productsRelations = exports.usersRelations = exports.shipments = exports.payments = exports.orderItems = exports.orders = exports.cartItems = exports.carts = exports.inventory = exports.prices = exports.productVariants = exports.products = exports.users = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
/** ================= Users ================= */
exports.users = (0, mysql_core_1.mysqlTable)("users", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    email: (0, mysql_core_1.varchar)("email", { length: 255 }).notNull(),
    password: (0, mysql_core_1.varchar)("password", { length: 255 }).notNull(),
    role: (0, mysql_core_1.varchar)("role", { length: 20 }).default("customer"),
    phone: (0, mysql_core_1.varchar)("phone", { length: 20 }),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
    emailIdx: (0, mysql_core_1.uniqueIndex)("email_idx").on(table.email),
}));
/** ================= Products ================= */
exports.products = (0, mysql_core_1.mysqlTable)("products", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    description: (0, mysql_core_1.text)("description"),
    brand: (0, mysql_core_1.varchar)("brand", { length: 100 }),
    status: (0, mysql_core_1.varchar)("status", { length: 20 }).default("ACTIVE"),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow(),
});
/** ================= Product Variants ================= */
exports.productVariants = (0, mysql_core_1.mysqlTable)("product_variants", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    productId: (0, mysql_core_1.int)("product_id").notNull().references(() => exports.products.id, { onDelete: 'cascade' }),
    sku: (0, mysql_core_1.varchar)("sku", { length: 100 }).notNull(),
    color: (0, mysql_core_1.varchar)("color", { length: 50 }),
    size: (0, mysql_core_1.varchar)("size", { length: 50 }),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
    skuIdx: (0, mysql_core_1.uniqueIndex)("sku_idx").on(table.sku),
}));
/** ================= Prices ================= */
exports.prices = (0, mysql_core_1.mysqlTable)("prices", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    variantId: (0, mysql_core_1.int)("variant_id").notNull().references(() => exports.productVariants.id, { onDelete: 'cascade' }),
    amount: (0, mysql_core_1.decimal)("amount", { precision: 10, scale: 2 }).notNull(),
    currency: (0, mysql_core_1.varchar)("currency", { length: 10 }).default("BDT"),
    validFrom: (0, mysql_core_1.timestamp)("valid_from").defaultNow(),
    validTo: (0, mysql_core_1.timestamp)("valid_to"),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
});
/** ================= Inventory ================= */
exports.inventory = (0, mysql_core_1.mysqlTable)("inventory", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    variantId: (0, mysql_core_1.int)("variant_id").notNull().references(() => exports.productVariants.id, { onDelete: 'cascade' }),
    quantity: (0, mysql_core_1.int)("quantity").notNull().default(0),
    warehouseLocation: (0, mysql_core_1.varchar)("warehouse_location", { length: 100 }),
    lastUpdated: (0, mysql_core_1.timestamp)("last_updated").defaultNow().onUpdateNow(),
}, (table) => ({
    variantIdx: (0, mysql_core_1.uniqueIndex)("variant_idx").on(table.variantId),
}));
/** ================= Carts ================= */
exports.carts = (0, mysql_core_1.mysqlTable)("carts", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    userId: (0, mysql_core_1.int)("user_id").references(() => exports.users.id, { onDelete: 'cascade' }),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow(),
});
/** ================= Cart Items ================= */
exports.cartItems = (0, mysql_core_1.mysqlTable)("cart_items", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    cartId: (0, mysql_core_1.int)("cart_id").notNull().references(() => exports.carts.id, { onDelete: 'cascade' }),
    variantId: (0, mysql_core_1.int)("variant_id").notNull().references(() => exports.productVariants.id, { onDelete: 'cascade' }),
    quantity: (0, mysql_core_1.int)("quantity").notNull().default(1),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow(),
});
/** ================= Orders ================= */
exports.orders = (0, mysql_core_1.mysqlTable)("orders", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    userId: (0, mysql_core_1.int)("user_id").notNull().references(() => exports.users.id, { onDelete: 'set null' }),
    status: (0, mysql_core_1.mysqlEnum)("status", ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]).default("PENDING"),
    totalAmount: (0, mysql_core_1.decimal)("total_amount", { precision: 12, scale: 2 }).notNull(),
    currency: (0, mysql_core_1.varchar)("currency", { length: 10 }).default("BDT"),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow(),
});
/** ================= Order Items ================= */
exports.orderItems = (0, mysql_core_1.mysqlTable)("order_items", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    orderId: (0, mysql_core_1.int)("order_id").notNull().references(() => exports.orders.id, { onDelete: 'cascade' }),
    variantId: (0, mysql_core_1.int)("variant_id").notNull().references(() => exports.productVariants.id),
    quantity: (0, mysql_core_1.int)("quantity").notNull(),
    price: (0, mysql_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
});
/** ================= Payments ================= */
exports.payments = (0, mysql_core_1.mysqlTable)("payments", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    orderId: (0, mysql_core_1.int)("order_id").notNull().references(() => exports.orders.id, { onDelete: 'cascade' }),
    amount: (0, mysql_core_1.decimal)("amount", { precision: 12, scale: 2 }).notNull(),
    currency: (0, mysql_core_1.varchar)("currency", { length: 10 }).default("BDT"),
    status: (0, mysql_core_1.mysqlEnum)("status", ["PENDING", "COMPLETED", "FAILED", "REFUNDED"]).default("PENDING"),
    provider: (0, mysql_core_1.varchar)("provider", { length: 50 }),
    transactionId: (0, mysql_core_1.varchar)("transaction_id", { length: 100 }),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow(),
});
/** ================= Shipments ================= */
exports.shipments = (0, mysql_core_1.mysqlTable)("shipments", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    orderId: (0, mysql_core_1.int)("order_id").notNull().references(() => exports.orders.id, { onDelete: 'cascade' }),
    address: (0, mysql_core_1.text)("address").notNull(),
    city: (0, mysql_core_1.varchar)("city", { length: 100 }).notNull(),
    postalCode: (0, mysql_core_1.varchar)("postal_code", { length: 20 }).notNull(),
    country: (0, mysql_core_1.varchar)("country", { length: 100 }).notNull(),
    phone: (0, mysql_core_1.varchar)("phone", { length: 20 }).notNull(),
    trackingNumber: (0, mysql_core_1.varchar)("tracking_number", { length: 100 }),
    status: (0, mysql_core_1.mysqlEnum)("status", ["PENDING", "SHIPPED", "DELIVERED", "RETURNED"]).default("PENDING"),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").defaultNow().onUpdateNow(),
});
// Relations definitions
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    orders: many(exports.orders),
    carts: many(exports.carts),
}));
exports.productsRelations = (0, drizzle_orm_1.relations)(exports.products, ({ many }) => ({
    variants: many(exports.productVariants),
}));
exports.productVariantsRelations = (0, drizzle_orm_1.relations)(exports.productVariants, ({ one, many }) => ({
    product: one(exports.products, {
        fields: [exports.productVariants.productId],
        references: [exports.products.id],
    }),
    prices: many(exports.prices),
    inventory: one(exports.inventory, {
        fields: [exports.productVariants.id],
        references: [exports.inventory.variantId]
    }),
}));
exports.cartsRelations = (0, drizzle_orm_1.relations)(exports.carts, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.carts.userId],
        references: [exports.users.id],
    }),
    items: many(exports.cartItems),
}));
exports.cartItemsRelations = (0, drizzle_orm_1.relations)(exports.cartItems, ({ one }) => ({
    cart: one(exports.carts, {
        fields: [exports.cartItems.cartId],
        references: [exports.carts.id],
    }),
    variant: one(exports.productVariants, {
        fields: [exports.cartItems.variantId],
        references: [exports.productVariants.id],
    }),
}));
exports.ordersRelations = (0, drizzle_orm_1.relations)(exports.orders, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.orders.userId],
        references: [exports.users.id],
    }),
    items: many(exports.orderItems),
    payment: one(exports.payments, {
        fields: [exports.orders.id],
        references: [exports.payments.orderId]
    }),
    shipment: one(exports.shipments, {
        fields: [exports.orders.id],
        references: [exports.shipments.orderId]
    }),
}));
exports.orderItemsRelations = (0, drizzle_orm_1.relations)(exports.orderItems, ({ one }) => ({
    order: one(exports.orders, {
        fields: [exports.orderItems.orderId],
        references: [exports.orders.id],
    }),
    variant: one(exports.productVariants, {
        fields: [exports.orderItems.variantId],
        references: [exports.productVariants.id],
    }),
}));
//# sourceMappingURL=schema.js.map