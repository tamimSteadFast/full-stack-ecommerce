import {
  mysqlTable,
  int,
  varchar,
  text,
  decimal,
  uniqueIndex,
  boolean,
  mysqlEnum,
  timestamp
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/** ================= Users ================= */
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).default("customer"),
  phone: varchar("phone", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  emailIdx: uniqueIndex("email_idx").on(table.email),
}));

/** ================= Products ================= */
export const products = mysqlTable("products", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  brand: varchar("brand", { length: 100 }),
  status: varchar("status", { length: 20 }).default("ACTIVE"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

/** ================= Product Variants ================= */
export const productVariants = mysqlTable("product_variants", {
  id: int("id").primaryKey().autoincrement(),
  productId: int("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
  sku: varchar("sku", { length: 100 }).notNull(),
  color: varchar("color", { length: 50 }),
  size: varchar("size", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
}, (table) => ({
  skuIdx: uniqueIndex("sku_idx").on(table.sku),
}));

/** ================= Prices ================= */
export const prices = mysqlTable("prices", {
  id: int("id").primaryKey().autoincrement(),
  variantId: int("variant_id").notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("BDT"),
  validFrom: timestamp("valid_from").defaultNow(),
  validTo: timestamp("valid_to"),
  createdAt: timestamp("created_at").defaultNow(),
});

/** ================= Inventory ================= */
export const inventory = mysqlTable("inventory", {
  id: int("id").primaryKey().autoincrement(),
  variantId: int("variant_id").notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  quantity: int("quantity").notNull().default(0),
  warehouseLocation: varchar("warehouse_location", { length: 100 }),
  lastUpdated: timestamp("last_updated").defaultNow().onUpdateNow(),
}, (table) => ({
  variantIdx: uniqueIndex("variant_idx").on(table.variantId),
}));

/** ================= Carts ================= */
export const carts = mysqlTable("carts", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

/** ================= Cart Items ================= */
export const cartItems = mysqlTable("cart_items", {
  id: int("id").primaryKey().autoincrement(),
  cartId: int("cart_id").notNull().references(() => carts.id, { onDelete: 'cascade' }),
  variantId: int("variant_id").notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  quantity: int("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

/** ================= Orders ================= */
export const orders = mysqlTable("orders", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: 'set null' }),
  status: mysqlEnum("status", ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]).default("PENDING"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("BDT"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

/** ================= Order Items ================= */
export const orderItems = mysqlTable("order_items", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  variantId: int("variant_id").notNull().references(() => productVariants.id),
  quantity: int("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

/** ================= Payments ================= */
export const payments = mysqlTable("payments", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("BDT"),
  status: mysqlEnum("status", ["PENDING", "COMPLETED", "FAILED", "REFUNDED"]).default("PENDING"),
  provider: varchar("provider", { length: 50 }),
  transactionId: varchar("transaction_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

/** ================= Shipments ================= */
export const shipments = mysqlTable("shipments", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  status: mysqlEnum("status", ["PENDING", "SHIPPED", "DELIVERED", "RETURNED"]).default("PENDING"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});


// Relations definitions
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  carts: many(carts),
}));

export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  prices: many(prices),
  inventory: one(inventory, {
    fields: [productVariants.id],
    references: [inventory.variantId]
  }),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  payment: one(payments, {
    fields: [orders.id],
    references: [payments.orderId]
  }),
  shipment: one(shipments, {
    fields: [orders.id],
    references: [shipments.orderId]
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));
