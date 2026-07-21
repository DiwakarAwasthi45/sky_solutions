"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AnimatedCounter({ from = 0, to, suffix = "", decimals = 0, className = "" }) {
  const el = useRef(null);

  useEffect(() => {
    const elRef = el.current;
    if (!elRef) return;

    const obj = { val: from };

    const tween = gsap.to(obj, {
      val: to,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        elRef.textContent = obj.val.toFixed(decimals) + suffix;
      },
    });

    ScrollTrigger.create({
      trigger: elRef,
      start: "top 85%",
      onEnter: () => tween.play(),
      once: true,
    });

    tween.pause();

    return () => {
      tween.kill();
    };
  }, [from, to, suffix, decimals]);

  return (
    <span ref={el} className={className}>
      {from.toFixed(decimals) + suffix}
    </span>
  );
}
