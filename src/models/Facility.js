import mongoose from "mongoose";

const FacilitySchema = new mongoose.Schema(
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

    description: {
      type: String,
      required: [true, "Description is required"],
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

export default mongoose.models.Facility ||
  mongoose.model("Facility", FacilitySchema);