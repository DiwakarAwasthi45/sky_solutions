import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PageHero({
  badge,
  title,
  highlight,
  description,
  primaryCta,
  primaryHref,
  secondaryCta,
  secondaryHref,
  children,
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#146A9A] via-[#1B8FD2] to-[#0B4F78] py-20 lg:py-24">
      {/* Decorative glows */}
      <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        {badge && (
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md">
            {badge}
          </span>
        )}

        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
          {title}{" "}
          {highlight && (
            <span className="block text-yellow-300">{highlight}</span>
          )}
        </h1>

        {description && (
          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-blue-100 sm:text-lg">
            {description}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {primaryCta && primaryHref && (
              <Link
                href={primaryHref}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-white px-7 py-3.5 font-semibold text-[#146A9A] shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                {primaryCta}
                <ArrowRight size={18} />
              </Link>
            )}

            {secondaryCta && secondaryHref && (
              <Link
                href={secondaryHref}
                className="inline-flex items-center gap-2.5 rounded-2xl border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition duration-300 hover:bg-white/20"
              >
                {secondaryCta}
              </Link>
            )}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
