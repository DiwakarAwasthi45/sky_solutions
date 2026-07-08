// src/app/admin/page.jsx

import { BookOpen, Users, Wrench, Quote, TrendingUp, TrendingDown } from "lucide-react";

const stats = [
  {
    title: "Courses",
    total: 12,
    trend: "+2 this month",
    trendUp: true,
    icon: BookOpen,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Students",
    total: 350,
    trend: "+18 this month",
    trendUp: true,
    icon: Users,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Services",
    total: 8,
    trend: "no change",
    trendUp: null,
    icon: Wrench,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Testimonials",
    total: 25,
    trend: "-1 this month",
    trendUp: true,
    icon: Quote,
    color: "bg-violet-50 text-violet-600",
  },
];

export default function Page() {
  return (
    <div>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your academy at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-medium text-gray-500">
                    {item.title}
                  </h2>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                    {item.total.toLocaleString()}
                  </p>
                </div>
                <div className={`shrink-0 rounded-lg p-2.5 ${item.color}`}>
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
                {item.trendUp === true && (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                )}
                {item.trendUp === false && (
                  <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                )}
                <span
                  className={
                    item.trendUp === true
                      ? "text-emerald-600"
                      : item.trendUp === false
                      ? "text-red-600"
                      : "text-gray-400"
                  }
                >
                  {item.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}