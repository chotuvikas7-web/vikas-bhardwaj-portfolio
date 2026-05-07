import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      maxlength: 50
    }
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
