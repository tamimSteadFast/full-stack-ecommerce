import { Router } from 'express';
import { 
  listProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProductVariants,
  createProductSchema,
  updateProductSchema
} from '../controllers/productController';
import { checkStock, updateInventory, updateInventorySchema } from '../controllers/inventoryController';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Products
router.get('/products', listProducts);
router.get('/products/:id', getProduct);
router.post('/products', authenticate, authorize(['admin']), validate(createProductSchema), createProduct);
router.put('/products/:id', authenticate, authorize(['admin']), validate(updateProductSchema), updateProduct);
router.delete('/products/:id', authenticate, authorize(['admin']), deleteProduct);

// Variants
router.get('/products/:id/variants', getProductVariants);

// Inventory
router.get('/inventory/:variantId', checkStock);
router.put('/inventory/:variantId', authenticate, authorize(['admin']), validate(updateInventorySchema), updateInventory);

export default router;
