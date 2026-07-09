import mongoose from "mongoose";

const UpcomingClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Class title is required"],
      trim: true,
    },

    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
    },

    time: {
      type: String,
      required: [true, "Time is required"],
      trim: true,
    },

    status: {
      type: String,
      required: [true, "Status is required"],
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Upcoming ||
  mongoose.model("Upcoming", UpcomingClassSchema);