import { Router } from "express";
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  productosStockBajo
} from "../controllers/productoController.js";

const router = Router();

// Rutas específicas antes de "/:id" para que no choquen con el parámetro dinámico
router.get("/alertas/stock-bajo", productosStockBajo);

router.get("/", obtenerProductos);
router.get("/:id", obtenerProductoPorId);
router.post("/", crearProducto);
router.put("/:id", actualizarProducto);
router.delete("/:id", eliminarProducto);

export default router;
