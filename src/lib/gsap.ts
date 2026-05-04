import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsap(): void {
  if (registered) return;
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({
    duration: 0.9,
    ease: "expo.out",
  });
  registered = true;
}

export function refreshScrollTrigger(): void {
  if (typeof window === "undefined") return;
  ScrollTrigger.refresh();
}

export { gsap, ScrollTrigger };
