import User from "./User";
import mongoose from "mongoose";

const FuncionarioSchema = new mongoose.Schema({
  cargo: { type: String, required: true },
  data_admissao: { type: Date, required: true }
});

// Verifica se o modelo já existe no cache do Mongoose
// OU se o discriminator já foi registrado no User
// e só então cria um novo.
const Funcionario = 
  mongoose.models.Funcionario || 
  (User.discriminators && User.discriminators['funcionario']) || 
  User.discriminator('funcionario', FuncionarioSchema);

export default Funcionario;
