"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function page() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/gallery");

      if (data.success) {
        setGallery(data.data || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#1877AE] to-[#1C8BCA] py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block bg-white/20 text-white px-5 py-2 rounded-full font-semibold">
            Our Gallery
          </span>

          <h1 className="mt-6 text-5xl md:text-6xl font-black text-white">
            Training & Events Gallery
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-blue-100">
            Explore our classrooms, workshops, computer labs, seminars,
            graduation ceremonies, and student activities.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center py-20 text-xl font-semibold">
              Loading Gallery...
            </div>
          ) : gallery.length === 0 ? (
            <div className="text-center py-20 text-xl font-semibold">
              No Images Found
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {gallery.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setSelectedImage(item)}
                  className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition duration-300"
                >
                  <div className="overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                      {item.description}
                    </p>
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
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full"
          >
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />

            <div className="bg-white p-6 rounded-b-xl">
              <h2 className="text-2xl font-bold">
                {selectedImage.title}
              </h2>

              <p className="mt-3 text-gray-600">
                {selectedImage.description}
              </p>

              <button
                onClick={() => setSelectedImage(null)}
                className="mt-6 bg-[#1877AE] text-white px-6 py-2 rounded-lg hover:bg-[#145f8b]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl bg-gradient-to-r from-[#1877AE] to-[#1C8BCA] p-12 text-center text-white">
            <h2 className="text-4xl font-black">
              Join Sky Solutions Today
            </h2>

            <p className="mt-5 text-blue-100 max-w-2xl mx-auto">
              Become a part of our professional learning environment and
              build your future with practical IT training.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/courses"
                className="bg-white text-[#1877AE] px-8 py-3 rounded-xl font-semibold"
              >
                View Courses
              </a>

              <a
                href="/contact"
                className="border border-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#1877AE]"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}