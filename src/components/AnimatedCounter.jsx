"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AnimatedCounter({ from = 0, to, suffix = "", decimals = 0, className = "" }) {
  const el = useRef(null);

  useEffect(() => {
    const elRef = el.current;
    if (!elRef) return;
    if (to === undefined || to === null) return;

    const obj = { val: from };

    const tween = gsap.to(obj, {
      val: to,
      duration: 2,
      ease: "power2.out",
      paused: true,
      onUpdate: () => {
        elRef.textContent = obj.val.toFixed(decimals) + suffix;
      },
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tween.play();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    observer.observe(elRef);

    return () => {
      observer.disconnect();
      tween.kill();
    };
  }, [from, to, suffix, decimals]);

  return (
    <span ref={el} className={className}>
      {from.toFixed(decimals) + suffix}
    </span>
  );
}
