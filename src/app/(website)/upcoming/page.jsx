"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Clock,
  CalendarDays,
  ArrowRight,
  MapPin,
  GraduationCap,
  User,
  Users,
  Radio,
  Timer,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const STATUS_STYLES = {
  Open: "bg-emerald-100 text-emerald-700",
  "Starting Soon": "bg-amber-100 text-amber-700",
  "Few Seats Left": "bg-orange-100 text-orange-700",
  "Seats Full": "bg-red-100 text-red-700",
  "Admission Closed": "bg-gray-200 text-gray-600",
  Completed: "bg-gray-300 text-gray-500",
};

const FILTERS = [
  { label: "All Batches", value: "All" },
  { label: "Open", value: "Open" },
  { label: "Starting Soon", value: "Starting Soon" },
  { label: "Few Seats Left", value: "Few Seats Left" },
];

function getClassStart(dateStr, timeStr) {
  if (!dateStr) return null;
  // time may be "7:00 AM - 9:00 AM" or "7:00 AM"
  const timePart = (timeStr || "").split("-")[0].trim();
  const full = `${dateStr} ${timePart}`;
  const parsed = new Date(full);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function getLiveStatus(item) {
  const start = getClassStart(item.date, item.time);
  const now = new Date();

  if (item.status === "Completed") return { ...item.statusInfo, status: "Completed" };

  if (start) {
    const diffMs = start - now;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    // Class has started today
    if (diffDays < 1 && diffMs < 0) {
      return { ...item.statusInfo, status: "Live" };
    }
    // Starting within 2 days
    if (diffMs >= 0 && diffDays <= 2) {
      return { ...item.statusInfo, status: "Starting Soon" };
    }
  }

  return { ...item.statusInfo, status: item.status };
}

function Countdown({ dateStr, timeStr }) {
  const [now, setNow] = useState(() => new Date());
  const start = useMemo(() => getClassStart(dateStr, timeStr), [dateStr, timeStr]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!start) {
    return (
      <p className="text-sm text-gray-500">
        {dateStr}
        {timeStr ? ` · ${timeStr}` : ""}
      </p>
    );
  }

  const diffMs = start - now;

  if (diffMs <= 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
        <Radio size={16} className="text-red-500 animate-pulse" />
        <span className="text-sm font-semibold text-red-600">
          LIVE NOW — Class in session
        </span>
      </div>
    );
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const units = [
    { value: days, label: "Days" },
    { value: hours, label: "Hrs" },
    { value: minutes, label: "Min" },
    { value: seconds, label: "Sec" },
  ];

  return (
    <div className="rounded-xl border border-[#1C8BCA]/20 bg-[#1C8BCA]/5 p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Timer size={14} className="text-[#1C8BCA]" />
        <span className="text-xs font-semibold text-[#1C8BCA] uppercase tracking-wide">
          Starts In
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {units.map((u) => (
          <div
            key={u.label}
            className="rounded-lg bg-white py-1.5 text-center shadow-sm border border-gray-100"
          >
            <p className="text-xl font-black text-gray-900 tabular-nums">
              {String(u.value).padStart(2, "0")}
            </p>
            <p className="text-[10px] text-gray-500 uppercase">{u.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeatBar({ filled, max }) {
  const pct = max > 0 ? Math.min(100, Math.round((filled / max) * 100)) : 0;
  const left = Math.max(0, max - filled);

  const barColor =
    left === 0
      ? "bg-red-500"
      : left <= 3
      ? "bg-orange-500"
      : left <= 8
      ? "bg-amber-500"
      : "bg-emerald-500";

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <Users size={14} className="text-[#1C8BCA]" />
          Seats filled: {filled} / {max}
        </span>
        {left === 0 ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
            <XCircle size={13} /> Full
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <CheckCircle2 size={13} /> {left} left
          </span>
        )}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function LiveBatchesPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [reservingId, setReservingId] = useState(null);
  const [tick, setTick] = useState(0);

  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/upcoming");
      if (data.success) {
        setBatches(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load batches");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBatches();
    const t = setInterval(() => setTick((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [fetchBatches]);

  const decorated = useMemo(
    () =>
      batches
        .filter((b) => b.isActive)
        .map((b) => ({
          ...b,
          live: getLiveStatus(b),
        })),
    [batches, tick]
  );

  const filtered = decorated.filter((b) =>
    filter === "All" ? true : b.live.status === filter
  );

  const stats = useMemo(() => {
    const total = decorated.length;
    const open = decorated.filter((b) => b.live.status === "Open").length;
    const fewLeft = decorated.filter((b) => b.live.status === "Few Seats Left").length;
    const live = decorated.filter((b) => b.live.status === "Live").length;
    return { total, open, fewLeft, live };
  }, [decorated]);

  const reserveSeat = async (batchId) => {
    setReservingId(batchId);
    try {
      const { data } = await axios.post("/api/upcoming/reserve", { upcomingId: batchId });
      toast.success(data.message);
      await fetchBatches();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.info("Please login to reserve a seat.");
        window.location.href = `/login?redirect=/upcoming`;
      } else {
        toast.error(error.response?.data?.message || "Reservation failed");
      }
    } finally {
      setReservingId(null);
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#146A9A] via-[#1B8FD2] to-[#0B4F78] py-20 lg:py-24">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            Live Batch System
          </span>
          <h1 className="mt-6 text-4xl font-black text-white sm:text-5xl md:text-6xl leading-tight">
            Upcoming Training
            <span className="block text-yellow-300">Batches & Live Countdown</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
            Watch live countdowns, check real-time seat availability, and reserve
            your spot before the batch fills up.
          </p>

          {/* Live stats */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Total Batches", value: stats.total, color: "text-white" },
              { label: "Open", value: stats.open, color: "text-emerald-300" },
              { label: "Few Seats Left", value: stats.fewLeft, color: "text-orange-300" },
              { label: "Live Now", value: stats.live, color: "text-red-300" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/20 bg-white/10 px-4 py-5 text-center backdrop-blur-md"
              >
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                <p className="mt-1 text-xs text-blue-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BATCHES */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          {/* Filters */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  filter === f.value
                    ? "bg-[#1C8BCA] text-white shadow-lg"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#1C8BCA] hover:text-[#1C8BCA]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner fullPage text="Loading live batches..." />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              No batches match this filter right now.
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => {
                const isLive = item.live.status === "Live";
                const isFull = (item.seatsFilled ?? 0) >= (item.maxSeats ?? 20);
                const isClosed =
                  item.live.status === "Admission Closed" ||
                  item.live.status === "Completed" ||
                  isFull;
                const statusKey =
                  item.live.status === "Live" ? "Starting Soon" : item.live.status;

                return (
                  <div
                    key={item._id}
                    className="group overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    {/* Image */}
                    {item.image && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <span
                          className={`absolute top-4 left-4 rounded-full px-4 py-1.5 text-xs font-semibold ${STATUS_STYLES[item.live.status] || STATUS_STYLES.Open}`}
                        >
                          {item.live.status}
                        </span>
                        {isLive && (
                          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white">
                            <Radio size={12} className="animate-pulse" />
                            LIVE
                          </span>
                        )}
                      </div>
                    )}

                    <div className="p-7">
                      {!item.image && (
                        <span
                          className={`inline-block rounded-full px-4 py-1.5 text-xs font-semibold ${STATUS_STYLES[item.live.status] || STATUS_STYLES.Open}`}
                        >
                          {item.live.status}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="mt-3 text-xl font-bold text-gray-900 group-hover:text-[#1C8BCA] transition">
                        {item.title}
                      </h3>

                      {/* Course + Instructor */}
                      <div className="mt-4 space-y-2">
                        {item.course && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <GraduationCap size={16} className="text-[#1C8BCA]" />
                            {item.course}
                          </div>
                        )}
                        {item.instructor && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User size={16} className="text-[#1C8BCA]" />
                            {item.instructor}
                          </div>
                        )}
                        {item.venue && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={16} className="text-[#1C8BCA]" />
                            {item.venue}
                          </div>
                        )}
                      </div>

                      {/* Date/Time */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays size={16} className="text-[#1C8BCA]" />
                          {item.date}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={16} className="text-[#1C8BCA]" />
                          {item.time}
                        </div>
                      </div>

                      {/* Countdown */}
                      <div className="mt-5">
                        <Countdown dateStr={item.date} timeStr={item.time} />
                      </div>

                      {/* Seat availability */}
                      <div className="mt-5">
                        <SeatBar
                          filled={item.seatsFilled ?? 0}
                          max={item.maxSeats ?? 20}
                        />
                      </div>

                      {/* Description */}
                      {item.description && (
                        <p className="mt-4 text-sm leading-6 text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {/* CTA */}
                      <div className="mt-6">
                        {isClosed ? (
                          <div className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-500">
                            <XCircle size={16} />
                            {isFull ? "Batch Full" : "Admission Closed"}
                          </div>
                        ) : (
                          <button
                            onClick={() => reserveSeat(item._id)}
                            disabled={reservingId === item._id}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#1C8BCA] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-sky-700 disabled:opacity-60"
                          >
                            {reservingId === item._id ? (
                              <>
                                <LoadingSpinner size={16} />
                                Reserving...
                              </>
                            ) : (
                              <>
                                Reserve a Seat
                                <ArrowRight size={16} />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-3 rounded-full bg-[#1C8BCA] px-8 py-4 font-semibold text-white transition hover:bg-sky-700"
            >
              View All Courses
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
