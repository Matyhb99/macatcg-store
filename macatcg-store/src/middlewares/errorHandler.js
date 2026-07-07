// Middleware global de errores: centraliza el formato de respuesta ante fallos
export const errorHandler = (error, req, res, next) => {
  console.error(error.stack);
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    mensaje: error.mensaje || "Error interno del servidor",
    error: error.message
  });
};
