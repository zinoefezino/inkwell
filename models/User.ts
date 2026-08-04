import mongoose, { Schema, models, model } from "mongoose";

const ProfileSchema = new Schema(
  {
    skills: { type: String, default: "" },
    snippet: { type: String, default: "" },
    tone: { type: String, default: "Concise & direct" },
  },
  { _id: false },
);

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, default: "" },
    profile: { type: ProfileSchema, default: () => ({}) },
  },
  { timestamps: true },
);

export default models.User || model("User", UserSchema);
