import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },

    image: {
      type: String,
      required: [true, "Image is required"],
      trim: true,
    },

    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
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

export default mongoose.models.Testimonial ||
  mongoose.model("Testimonial", TestimonialSchema);