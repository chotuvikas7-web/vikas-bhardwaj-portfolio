import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100
    },
    role: {
      type: String,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    linkedIn: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    resume: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
