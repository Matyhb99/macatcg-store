import mongoose from "mongoose";

// Cada venta contiene uno o más productos (items), relacionados por ObjectId
const itemVentaSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1
    },
    precioUnitario: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const ventaSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true
    },
    items: {
      type: [itemVentaSchema],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    canal: {
      type: String,
      enum: ["Tienda fisica", "Online", "Redes sociales"],
      default: "Tienda fisica"
    },
    estado: {
      type: String,
      enum: ["pendiente", "completada", "cancelada"],
      default: "completada"
    }
  },
  {
    timestamps: true
  }
);

const Venta = mongoose.model("Venta", ventaSchema);

export default Venta;
