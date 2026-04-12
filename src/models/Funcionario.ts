import User from "./User";
import mongoose from "mongoose";

const FuncionarioSchema = new mongoose.Schema({
  cargo: {type: String, required: true},
  data_admissao: {type: Date, required: true}
})

export default mongoose.models.Funcionario || User.discriminator('funcionario', FuncionarioSchema);
