import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: 1200
    },
    techStack: {
      type: [String],
      required: true,
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: "Add at least one technology"
      }
    },
    githubLink: {
      type: String,
      trim: true,
      default: ""
    },
    liveLink: {
      type: String,
      trim: true,
      default: ""
    },
    image: {
      type: String,
      trim: true,
      default: ""
    },
    category: {
      type: String,
      trim: true,
      required: [true, "Category is required"],
      maxlength: 100,
      default: "Website"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
