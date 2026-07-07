import mongoose from "mongoose";

// Representa a un cliente de la tienda (útil para fidelización y marketing)
const clienteSchema = new mongoose.Schema(
  {
    rut: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    apellido: {
      type: String,
      required: true,
      trim: true
    },
    correo: {
      type: String,
      required: true,
      match: /^\S+@\S+\.\S+$/
    },
    telefono: {
      type: String
    },
    juegosFavoritos: {
      type: [String],
      default: [] // ej: ["Pokemon", "Magic"] -> permite segmentar promociones
    },
    aceptaPromociones: {
      type: Boolean,
      default: true // si acepta recibir novedades/promos por correo
    }
  },
  {
    timestamps: true
  }
);

const Cliente = mongoose.model("Cliente", clienteSchema);

export default Cliente;
