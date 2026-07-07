import mongoose from "mongoose";

// Esto conecta la aplicación a MongoDB Atlas usando la URI definida en .env
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Atlas conectado correctamente");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas");
    console.error(error.message);
    process.exit(1); // Sin base de datos, no tiene sentido levantar la API
  }
};

export default connectDB;
