import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    image: {
      type: String,
      required: [true, "Image is required"],
      trim: true,
    },

    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    features:{
      type: [String],
      default: [],
      required: [true, "Features are required"],
      trim: true,
    },


    status: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);