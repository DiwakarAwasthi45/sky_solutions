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
      required: [true, "Course image is required"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: 1,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },

    syllabus: [
      {
        module: {
          type: String,
          required: [true, "Module name is required"],
          trim: true,
        },

        topics: [
          {
            title: {
              type: String,
              required: [true, "Topic title is required"],
              trim: true,
            },
          },
        ],
      },
    ],

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Course ||
  mongoose.model("Course", CourseSchema);