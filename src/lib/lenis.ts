import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "./gsap";

let instance: Lenis | null = null;

export function initLenis(): Lenis | null {
  if (typeof window === "undefined") return null;
  if (instance) return instance;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return null;

  registerGsap();

  instance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
  });

  instance.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time: number) => {
    instance?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return instance;
}

export function getLenis(): Lenis | null {
  return instance;
}

export function scrollTo(target: string | HTMLElement, offset = 0): void {
  if (!instance) {
    const el =
      typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  instance.scrollTo(target, { offset });
}
