import mongoose from "mongoose";

const ConteudoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: "" },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.Conteudo ||
  mongoose.model("Conteudo", ConteudoSchema);
