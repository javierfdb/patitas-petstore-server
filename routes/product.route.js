import { Router } from "express";
import {productsController} from "../controllers/product.controller.js";

const router = Router();

router.get('/productos', productsController.getAllProducts);
router.get("/productos/:id", productsController.getSingleProduct);
router.post('/productos', productsController.cargarProduct);
router.put("/productos/:id", productsController.updateProduct);
router.delete("/productos/:id", productsController.deleteProduct);

export default router;