import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true,
      trim: true,
    },

    siteTitle: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    logo: {
      type: String,
      default: "",
    },

    favicon: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    alternatePhone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    googleMap: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    facebook: {
      type: String,
      default: "",
    },

    instagram: {
      type: String,
      default: "",
    },

    youtube: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    twitter: {
      type: String,
      default: "",
    },

    whatsapp: {
      type: String,
      default: "",
    },

    officeHours: {
      type: String,
      default: "",
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    footerCopyright: {
      type: String,
      default: "",
    },

    heroTitle: {
      type: String,
      default: "",
    },

    heroSubtitle: {
      type: String,
      default: "",
    },

    heroImage: {
      type: String,
      default: "",
    },

    seoKeywords: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Setting ||
  mongoose.model("Setting", SettingSchema);