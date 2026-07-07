import Venta from "../models/Venta.js";
import Producto from "../models/Producto.js";

// GET /api/ventas
export const obtenerVentas = async (req, res, next) => {
  try {
    const ventas = await Venta.find()
      .populate("cliente", "nombre apellido correo")
      .populate("items.producto", "nombre codigo juego")
      .sort({ createdAt: -1 });
    res.status(200).json(ventas);
  } catch (error) {
    next(error);
  }
};

// GET /api/ventas/:id
export const obtenerVentaPorId = async (req, res, next) => {
  try {
    const venta = await Venta.findById(req.params.id)
      .populate("cliente", "nombre apellido correo")
      .populate("items.producto", "nombre codigo juego");
    if (!venta) {
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }
    res.status(200).json(venta);
  } catch (error) {
    next(error);
  }
};

// POST /api/ventas
// Body esperado:
// {
//   "cliente": "<idCliente>",
//   "canal": "Tienda fisica",
//   "items": [
//     { "producto": "<idProducto>", "cantidad": 2, "precioUnitario": 3500 }
//   ]
// }
// Calcula el total automáticamente y descuenta stock de cada producto vendido.
export const crearVenta = async (req, res, next) => {
  try {
    const { cliente, items, canal, estado } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ mensaje: "La venta debe incluir al menos un producto" });
    }

    // Verifica stock disponible antes de confirmar la venta
    for (const item of items) {
      const producto = await Producto.findById(item.producto);
      if (!producto) {
        return res.status(404).json({ mensaje: `Producto ${item.producto} no encontrado` });
      }
      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          mensaje: `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}`
        });
      }
    }

    const total = items.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);

    const venta = await Venta.create({ cliente, items, canal, estado, total });

    // Descuenta el stock vendido de cada producto
    for (const item of items) {
      await Producto.findByIdAndUpdate(item.producto, {
        $inc: { stock: -item.cantidad }
      });
    }

    res.status(201).json(venta);
  } catch (error) {
    next(error);
  }
};

// PUT /api/ventas/:id  (permite corregir estado o canal, no recalcula stock)
export const actualizarVenta = async (req, res, next) => {
  try {
    const venta = await Venta.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!venta) {
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }
    res.status(200).json(venta);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/ventas/:id
export const eliminarVenta = async (req, res, next) => {
  try {
    const venta = await Venta.findByIdAndDelete(req.params.id);
    if (!venta) {
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }
    res.status(200).json({ mensaje: "Venta eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};
