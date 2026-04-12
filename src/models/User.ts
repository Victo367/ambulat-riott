import mongoose, { Schema, models, model } from "mongoose";
import bcrypt from "bcryptjs";

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

UserSchema.pre("save", async function () {
  const user = this as any;

  if (!user.isModified("senha")) return;

  const salt = await bcrypt.genSalt(10);
  user.senha = await bcrypt.hash(user.senha, salt);
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
