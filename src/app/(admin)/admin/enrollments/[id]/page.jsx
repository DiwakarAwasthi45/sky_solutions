"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

export default function EnrollmentDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchEnrollment = async () => {
      try {
        const { data } = await axios.get(`/api/enrollments/${id}`);
        setEnrollment(data?.data || data || null);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load enrollment");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [id]);

  if (!id) return <div className="p-6">Invalid enrollment id.</div>;
  if (loading) return <div className="p-6">Loading...</div>;
  if (!enrollment) return <div className="p-6">No enrollment found.</div>;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Enrollment Details</h1>

      <div className="grid gap-4 rounded-md border border-gray-300 p-4">
        <p><span className="font-semibold">Full Name:</span> {enrollment.fullName}</p>
        <p><span className="font-semibold">Email:</span> {enrollment.email}</p>
        <p><span className="font-semibold">Phone:</span> {enrollment.phone}</p>
        <p><span className="font-semibold">DOB:</span> {enrollment.dob ? new Date(enrollment.dob).toLocaleDateString() : "-"}</p>
        <p><span className="font-semibold">Gender:</span> {enrollment.gender}</p>
        <p><span className="font-semibold">Address:</span> {enrollment.address || "-"}</p>
        <p><span className="font-semibold">Batch:</span> {enrollment.batch}</p>
        <p><span className="font-semibold">Course:</span> {enrollment.course?.title || enrollment.course?.name || "-"}</p>
        <p><span className="font-semibold">Payment Status:</span> {enrollment.paymentStatus}</p>
        <p><span className="font-semibold">Enrollment Status:</span> {enrollment.enrollmentStatus}</p>
        <p><span className="font-semibold">Message:</span> {enrollment.message || "-"}</p>
      </div>
    </div>
  );
}