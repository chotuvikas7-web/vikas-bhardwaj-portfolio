import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    email: { type: String, required: true, trim: true, lowercase: true },
    countryCode: { type: String, trim: true, maxlength: 10 },
    phone: { type: String, trim: true, maxlength: 30 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    subject: { type: String, trim: true, maxlength: 250 },
    autoReplied: { type: Boolean, default: false }
  },
  { timestamps: true }
);

messageSchema.index({ createdAt: -1 });

export default mongoose.model("Message", messageSchema);
