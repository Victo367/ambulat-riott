import mongoose, { Schema, models, model } from "mongoose";

const options = {
  discriminatorKey: "tipo_usuario",
  timestamps: { createdAt: "data_criacao" }
};

const UserSchema = new mongoose.Schema({
  nome: {type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  status: {
    type: String,
    enum: ["ativo", "inativo"],
    default: "ativo"
  }
}, options);

export default mongoose.models.User || mongoose.model("User", UserSchema);
