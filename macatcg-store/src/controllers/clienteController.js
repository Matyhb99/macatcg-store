import Cliente from "../models/Cliente.js";

// GET /api/clientes
export const obtenerClientes = async (req, res, next) => {
  try {
    const clientes = await Cliente.find().sort({ createdAt: -1 });
    res.status(200).json(clientes);
  } catch (error) {
    next(error);
  }
};

// GET /api/clientes/:id
export const obtenerClientePorId = async (req, res, next) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
    res.status(200).json(cliente);
  } catch (error) {
    next(error);
  }
};

// POST /api/clientes
export const crearCliente = async (req, res, next) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    next(error);
  }
};

// PUT /api/clientes/:id
export const actualizarCliente = async (req, res, next) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
    res.status(200).json(cliente);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/clientes/:id
export const eliminarCliente = async (req, res, next) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
    res.status(200).json({ mensaje: "Cliente eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

// GET /api/clientes/marketing/lista-promociones
// Clientes que aceptan recibir promociones, agrupados por juego favorito.
// Sirve para armar campañas segmentadas (ej: "promo Pokemon" solo a fans de Pokemon).
export const clientesParaPromociones = async (req, res, next) => {
  try {
    const { juego } = req.query;
    const filtro = { aceptaPromociones: true };
    if (juego) filtro.juegosFavoritos = juego;

    const clientes = await Cliente.find(filtro).select(
      "nombre apellido correo juegosFavoritos"
    );
    res.status(200).json(clientes);
  } catch (error) {
    next(error);
  }
};
