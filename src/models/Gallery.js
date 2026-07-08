import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Image is required"],
      trim: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    status: {
      type: Boolean,
      default: true,
    },

   
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Gallery ||
  mongoose.model("Gallery", GallerySchema);