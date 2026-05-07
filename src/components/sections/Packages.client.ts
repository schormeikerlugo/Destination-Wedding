import { gsap, registerGsap } from "@lib/gsap";
import { prefersReducedMotion } from "@lib/reduced-motion";

registerGsap();

const reduce = prefersReducedMotion();

if (!reduce) {
  gsap.from("[data-invest-title] .invest__title-line > span", {
    yPercent: 110,
    opacity: 0,
    duration: 1.1,
    stagger: 0.1,
    ease: "expo.out",
    scrollTrigger: {
      trigger: "[data-invest-title]",
      start: "top 85%",
      once: true,
    },
  });

  gsap.from("[data-invest-card]", {
    y: 32,
    opacity: 0,
    duration: 0.9,
    stagger: 0.07,
    ease: "expo.out",
    scrollTrigger: {
      trigger: "[data-invest-grid]",
      start: "top 80%",
      once: true,
    },
  });
}
