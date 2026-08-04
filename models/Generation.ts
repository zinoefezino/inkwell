import { Schema, models, model } from "mongoose";

const GenerationSchema = new Schema(
  {
    userId: { type: String, required: true, index: true }, // Clerk user id
    type: { type: String, enum: ["proposal", "cv"], required: true },
    posting: { type: String, required: true },
    input: { type: String }, // original CV text, only set for type: "cv"
    output: { type: String, required: true },
  },
  { timestamps: true },
);

export default models.Generation || model("Generation", GenerationSchema);
