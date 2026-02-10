import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { products, productVariants, prices, inventory, variantAttributes } from '../db/schema';
import { eq, like, and, sql, desc } from 'drizzle-orm';
import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    brand: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
    variants: z.array(z.object({
      sku: z.string().min(1),
      price: z.number().min(0),
      stock: z.number().min(0),
      attributes: z.array(z.object({
        name: z.string().min(1),
        value: z.string().min(1)
      })).optional()
    })).optional()
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    brand: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  }),
});

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search as string;
    const brand = req.query.brand as string;

    let whereClause = undefined;
    const conditions = [];

    if (search) {
      conditions.push(like(products.name, `%${search}%`));
    }
    if (brand) {
      conditions.push(eq(products.brand, brand));
    }
    
    // Default to active only for public? Or admin sees all? 
    // Usually public API shows ACTIVE.
    // conditions.push(eq(products.status, 'ACTIVE')); 
    
    if (conditions.length > 0) {
      whereClause = and(...conditions);
    }

    const productsList = await db.query.products.findMany({
      where: whereClause,
      limit: limit,
      offset: offset,
      orderBy: [desc(products.createdAt)],
      with: {
        variants: {
          with: {
            prices: true,
            inventory: true
          }
        }
      }
    });

    const totalCountResult = await db.select({ count: sql<number>`count(*)` }).from(products).where(whereClause);
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
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
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
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, brand, status, variants } = req.body;

    // Use transaction to ensure data integrity
    await db.transaction(async (tx) => {
      // 1. Create Product
      const [productResult] = await tx.insert(products).values({
        name,
        description,
        brand,
        status: status || 'ACTIVE',
      });
      const productId = (productResult as any).insertId;

      // 2. Create Variants
      if (variants && variants.length > 0) {
        for (const variant of variants) {
          const [variantResult] = await tx.insert(productVariants).values({
            productId,
            sku: variant.sku,
          });
          const variantId = (variantResult as any).insertId;

          // 3. Create Price
          await tx.insert(prices).values({
            variantId,
            amount: variant.price.toString(),
            currency: 'BDT',
          });

          // 4. Create Inventory
          await tx.insert(inventory).values({
            variantId,
            quantity: variant.stock,
          });

          // 5. Create Attributes
          if (variant.attributes && variant.attributes.length > 0) {
            for (const attr of variant.attributes) {
              await tx.insert(variantAttributes).values({
                variantId,
                name: attr.name,
                value: attr.value,
              });
            }
          }
        }
      }
    });

    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    const { name, description, brand, status } = req.body;
    
    await db.update(products).set({
      name,
      description,
      brand,
      status,
    }).where(eq(products.id, id));

    res.json({ message: 'Product updated' });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    await db.delete(products).where(eq(products.id, id));
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

export const getProductVariants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.id as string);
    const variants = await db.query.productVariants.findMany({
      where: eq(productVariants.productId, productId),
      with: {
        prices: true,
        inventory: true
      }
    });
    res.json(variants);
  } catch (error) {
    next(error);
  }
};
