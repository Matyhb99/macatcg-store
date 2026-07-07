import mongoose from "mongoose";

// Representa una carta o producto TCG disponible en la tienda
const productoSchema = new mongoose.Schema(
  {
    codigo: {
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
    juego: {
      type: String,
      required: true,
      enum: ["Pokemon", "Magic", "Yugioh", "One Piece", "Otro"]
    },
    edicion: {
      type: String,
      required: true
    },
    rareza: {
      type: String,
      required: true
    },
    categoria: {
      type: String,
      enum: ["Carta suelta", "Sobre", "Caja", "Mazo", "Accesorio"],
      default: "Carta suelta"
    },
    precio: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    stockMinimo: {
      type: Number,
      default: 3 // bajo este umbral se considera "stock bajo" para reabastecer
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Producto = mongoose.model("Producto", productoSchema);

export default Producto;
