import express from "express";
import cors from "cors";

import productoRoutes from "./routes/productoRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import ventaRoutes from "./routes/ventaRoutes.js";
import reporteRoutes from "./routes/reporteRoutes.js";

import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*"
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Tienda TCG funcionando");
});

app.use("/api/productos", productoRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/reportes", reporteRoutes);

// Deben ir al final, después de todas las rutas
app.use(notFound);
app.use(errorHandler);

export default app;
