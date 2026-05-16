import mongoose from "mongoose";

const HistoricoSchema = new mongoose.Schema(
  {
    acao: { type: String, required: true },
    data: { type: Date, default: Date.now },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    usuarioNome: { type: String },
  },
  { _id: false }
);

const AgendamentoSchema = new mongoose.Schema(
  {
    paciente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profissional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    data: { type: String, required: true },
    hora: { type: String, required: true },
    tipo: { type: String, default: "Consulta" },
    especialidade: { type: String },
    status: {
      type: String,
      enum: ["confirmado", "pendente", "cancelado", "realizado", "ausente"],
      default: "pendente",
    },
    modalidade: {
      type: String,
      enum: ["Presencial", "Online"],
      default: "Presencial",
    },
    observacoes: { type: String, default: "" },
    historico: [HistoricoSchema],
    criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

AgendamentoSchema.index({ data: 1, hora: 1, profissional: 1 });

const Agendamento =
  mongoose.models.Agendamento ||
  mongoose.model("Agendamento", AgendamentoSchema);

export default Agendamento;
