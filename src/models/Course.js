import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    image: {
      type: String,
      required: [true, "Image is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    price: {
      type: String,
      required: [true, "Price is required"],
      trim: true,
    },

    syllabus: [
      {
        module: {
          type: String,
          required: true,
          trim: true,
        },

        topics: [
          {
            title: {
              type: String,
              required: true,
              trim: true,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Course ||
  mongoose.model("Course", CourseSchema);