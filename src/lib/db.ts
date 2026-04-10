import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("Já conectado ao MongoDB");
      return;
    }

    await mongoose.connect(process.env.MONGO_URL!);

    console.log("MongoDB conectado com sucesso");
  } catch (error) {
    console.error("Erro ao conectar no MongoDB:", error);
  }
}
