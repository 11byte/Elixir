import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  subject: String,
  body: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Email = mongoose.models.Email || mongoose.model("Email", emailSchema);

export default Email;
