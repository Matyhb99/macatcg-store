import Producto from "../models/Producto.js";

// GET /api/productos  (con filtros opcionales por query string)
export const obtenerProductos = async (req, res, next) => {
  try {
    const { juego, categoria, activo } = req.query;
    const filtro = {};
    if (juego) filtro.juego = juego;
    if (categoria) filtro.categoria = categoria;
    if (activo !== undefined) filtro.activo = activo === "true";

    const productos = await Producto.find(filtro).sort({ createdAt: -1 });
    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
};

// GET /api/productos/:id
export const obtenerProductoPorId = async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.status(200).json(producto);
  } catch (error) {
    next(error);
  }
};

// POST /api/productos
export const crearProducto = async (req, res, next) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (error) {
    next(error);
  }
};

// PUT /api/productos/:id
export const actualizarProducto = async (req, res, next) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.status(200).json(producto);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/productos/:id
export const eliminarProducto = async (req, res, next) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.status(200).json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

// GET /api/productos/alertas/stock-bajo
// Lista los productos que necesitan reposición: clave para no perder ventas
export const productosStockBajo = async (req, res, next) => {
  try {
    const productos = await Producto.find({
      $expr: { $lte: ["$stock", "$stockMinimo"] },
      activo: true
    }).sort({ stock: 1 });
    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
};
