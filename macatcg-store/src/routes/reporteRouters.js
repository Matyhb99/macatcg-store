import { Router } from "express";
import {
  productosMasVendidos,
  ventasPorMes,
  clientesFrecuentes,
  ventasPorCanal
} from "../controllers/reporteController.js";

const router = Router();

router.get("/productos-mas-vendidos", productosMasVendidos);
router.get("/ventas-por-mes", ventasPorMes);
router.get("/clientes-frecuentes", clientesFrecuentes);
router.get("/ventas-por-canal", ventasPorCanal);

export default router;
