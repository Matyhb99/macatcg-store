import Venta from "../models/Venta.js";

// GET /api/reportes/productos-mas-vendidos
// Responde a: "¿qué cartas/productos deberíamos promocionar o reabastecer?"
export const productosMasVendidos = async (req, res, next) => {
  try {
    const limite = Number(req.query.limite) || 10;

    const resultado = await Venta.aggregate([
      { $match: { estado: "completada" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.producto",
          unidadesVendidas: { $sum: "$items.cantidad" },
          ingresosGenerados: {
            $sum: { $multiply: ["$items.cantidad", "$items.precioUnitario"] }
          }
        }
      },
      { $sort: { unidadesVendidas: -1 } },
      { $limit: limite },
      {
        $lookup: {
          from: "productos",
          localField: "_id",
          foreignField: "_id",
          as: "producto"
        }
      },
      { $unwind: "$producto" },
      {
        $project: {
          _id: 0,
          producto: "$producto.nombre",
          codigo: "$producto.codigo",
          juego: "$producto.juego",
          unidadesVendidas: 1,
          ingresosGenerados: 1
        }
      }
    ]);

    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

// GET /api/reportes/ventas-por-mes
// Responde a: "¿estamos repuntando o seguimos con bajón?" -> tendencia mensual
export const ventasPorMes = async (req, res, next) => {
  try {
    const resultado = await Venta.aggregate([
      { $match: { estado: "completada" } },
      {
        $group: {
          _id: { anio: { $year: "$createdAt" }, mes: { $month: "$createdAt" } },
          totalVentas: { $sum: "$total" },
          cantidadTransacciones: { $sum: 1 }
        }
      },
      { $sort: { "_id.anio": 1, "_id.mes": 1 } }
    ]);

    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

// GET /api/reportes/clientes-frecuentes
// Responde a: "¿quiénes son mis mejores clientes para fidelizar?"
export const clientesFrecuentes = async (req, res, next) => {
  try {
    const limite = Number(req.query.limite) || 10;

    const resultado = await Venta.aggregate([
      { $match: { estado: "completada" } },
      {
        $group: {
          _id: "$cliente",
          totalGastado: { $sum: "$total" },
          cantidadCompras: { $sum: 1 }
        }
      },
      { $sort: { totalGastado: -1 } },
      { $limit: limite },
      {
        $lookup: {
          from: "clientes",
          localField: "_id",
          foreignField: "_id",
          as: "cliente"
        }
      },
      { $unwind: "$cliente" },
      {
        $project: {
          _id: 0,
          nombre: "$cliente.nombre",
          apellido: "$cliente.apellido",
          correo: "$cliente.correo",
          totalGastado: 1,
          cantidadCompras: 1
        }
      }
    ]);

    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

// GET /api/reportes/ventas-por-canal
// Responde a: "¿por dónde me están comprando más: tienda, online o redes?"
// Útil para decidir dónde invertir esfuerzo de difusión.
export const ventasPorCanal = async (req, res, next) => {
  try {
    const resultado = await Venta.aggregate([
      { $match: { estado: "completada" } },
      {
        $group: {
          _id: "$canal",
          totalVentas: { $sum: "$total" },
          cantidadTransacciones: { $sum: 1 }
        }
      },
      { $sort: { totalVentas: -1 } }
    ]);

    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
