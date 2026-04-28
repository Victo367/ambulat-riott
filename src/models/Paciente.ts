import User from "./User";
import mongoose from "mongoose";

const PacienteSchema = new mongoose.Schema({
  pronomes: {type: String, required: true},
  identidade_genero: {type: String, required:true},
  data_nascimento: {type: Date, required: true},
  telefone: {type: String, required: true, trim:true},
  terapia_hormonal: { type: Boolean, default: false }
})

export default mongoose.models.Paciente || User.discriminator('paciente', PacienteSchema);
