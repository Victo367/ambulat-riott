import mongoose from "mongoose";

const ConteudoImagemSchema = new mongoose.Schema(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    filename: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.ConteudoImagem ||
  mongoose.model("ConteudoImagem", ConteudoImagemSchema);
