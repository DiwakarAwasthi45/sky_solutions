"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({ children, className = "", from = { y: 60, opacity: 0 }, to = { y: 0, opacity: 1 }, delay = 0, duration = 0.8 }) {
  const el = useRef(null);

  useEffect(() => {
    const elRef = el.current;
    if (!elRef) return;

    gsap.fromTo(elRef, from, {
      ...to,
      duration,
      delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: elRef,
        start: "top 85%",
        once: true,
      },
    });
  }, []);

  return (
    <div ref={el} className={className}>
      {children}
    </div>
  );
}
