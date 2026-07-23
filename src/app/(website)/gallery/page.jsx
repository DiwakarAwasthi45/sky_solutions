"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  X,
  Grid3X3,
  Images,
} from "lucide-react";

export default function GalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/gallery");
      if (data.success) {
        setGallery(data.data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const filteredGallery =
    activeFilter === "all"
      ? gallery
      : gallery.filter((item) => item.category === activeFilter);

  const openLightbox = (item) => setSelectedImage(item);
  const closeLightbox = () => setSelectedImage(null);

  const navigateImage = (direction) => {
    const list = filteredGallery.length > 0 ? filteredGallery : gallery;
    const currentIndex = list.findIndex(
      (item) => item._id === selectedImage?._id
    );
    if (currentIndex === -1) return;

    const nextIndex =
      direction === "next"
        ? (currentIndex + 1) % list.length
        : (currentIndex - 1 + list.length) % list.length;

    setSelectedImage(list[nextIndex]);
  };

  const categories = [
    ...new Set(gallery.map((item) => item.category).filter(Boolean)),
  ];

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f4c75] via-[#1877AE] to-[#1C8BCA] py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <Images size={16} />
            Photo Gallery
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
            Training & Events
            <span className="block text-blue-200 mt-1">Gallery</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-blue-100 leading-relaxed">
            Explore our classrooms, workshops, computer labs, seminars,
            graduation ceremonies, and student activities.
          </p>

          <div className="mt-8 flex justify-center gap-8 text-blue-100">
            <div className="text-center">
              <p className="text-3xl font-black text-white">
                {gallery.length}
              </p>
              <p className="text-sm mt-1">Photos</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-black text-white">
                {categories.length || 1}
              </p>
              <p className="text-sm mt-1">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      {categories.length > 0 && (
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setActiveFilter("all")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeFilter === "all"
                    ? "bg-[#1877AE] text-white shadow-md shadow-sky-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Grid3X3 size={14} />
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeFilter === cat
                      ? "bg-[#1877AE] text-white shadow-md shadow-sky-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center py-24">
              <div className="w-14 h-14 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin mx-auto" />
              <p className="mt-5 text-gray-500 font-medium">
                Loading gallery...
              </p>
            </div>
          ) : gallery.length === 0 ? (
            <div className="text-center py-24">
              <Camera
                size={56}
                className="mx-auto text-gray-300 mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-700">
                No Photos Yet
              </h3>
              <p className="text-gray-400 mt-2">
                Gallery images will appear here once uploaded.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredGallery.map((item, index) => (
                <div
                  key={item._id}
                  onClick={() => openLightbox(item)}
                  className="group cursor-pointer rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-semibold truncate">
                        {item.title}
                      </p>
                    </div>
                  </div>

                  <div className="p-4">
                    {item.category && (
                      <span className="inline-block px-2 py-0.5 bg-sky-50 text-sky-600 text-xs rounded-full font-medium">
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition z-50 bg-white/10 rounded-full p-2"
          >
            <X size={24} />
          </button>

          {/* Nav Left */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("prev");
            }}
            className="absolute left-4 text-white/70 hover:text-white transition z-50 bg-white/10 hover:bg-white/20 rounded-full p-3"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Nav Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("next");
            }}
            className="absolute right-4 text-white/70 hover:text-white transition z-50 bg-white/10 hover:bg-white/20 rounded-full p-3"
          >
            <ChevronRight size={24} />
          </button>

          {/* Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full"
          >
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />

            <div className="mt-4 text-center">
              <h2 className="text-xl font-bold text-white">
                {selectedImage.title}
              </h2>
              {selectedImage.category && (
                <p className="text-white/50 text-sm mt-1">
                  {selectedImage.category}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f4c75] via-[#1877AE] to-[#1C8BCA] p-12 md:p-16 text-center text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-black">
                Join Sky Solutions Today
              </h2>

              <p className="mt-5 text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed">
                Become a part of our professional learning environment and
                build your future with practical IT training.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href="/courses"
                  className="bg-white text-[#1877AE] px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg shadow-black/10"
                >
                  View Courses
                </a>
                <a
                  href="/contact"
                  className="border-2 border-white/40 px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
