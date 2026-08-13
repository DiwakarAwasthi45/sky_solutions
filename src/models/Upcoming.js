import mongoose from "mongoose";

const UpcomingClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Class title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
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

    venue: {
      type: String,
      default: "",
      trim: true,
    },

    course: {
      type: String,
      default: "",
      trim: true,
    },

    instructor: {
      type: String,
      default: "",
      trim: true,
    },

    maxSeats: {
      type: Number,
      default: 20,
      min: [1, "maxSeats must be at least 1"],
    },

    seatsFilled: {
      type: Number,
      default: 0,
      min: [0, "seatsFilled cannot be negative"],
    },

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["Open", "Starting Soon", "Few Seats Left", "Seats Full", "Admission Closed", "Completed"],
      default: "Open",
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