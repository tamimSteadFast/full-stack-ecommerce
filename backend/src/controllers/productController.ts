import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { products, productVariants, prices, inventory } from '../db/schema';
import { eq, like, and, sql, desc } from 'drizzle-orm';
import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    brand: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
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
    const { name, description, brand, status } = req.body;
    const [result] = await db.insert(products).values({
      name,
      description,
      brand,
      status,
    });
    const insertId = (result as any).insertId;
    res.status(201).json({ id: insertId, message: 'Product created' });
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
