import { gsap, ScrollTrigger, registerGsap } from "@lib/gsap";
import { prefersReducedMotion } from "@lib/reduced-motion";

registerGsap();

if (!prefersReducedMotion()) {
  gsap.from("[data-manifest-title] .manifest__line > span", {
    yPercent: 110,
    opacity: 0,
    duration: 1.2,
    stagger: 0.1,
    ease: "expo.out",
    scrollTrigger: {
      trigger: "[data-manifest-title]",
      start: "top 85%",
      once: true,
    },
  });

  ScrollTrigger.batch("[data-manifest-photo]", {
    start: "top 88%",
    onEnter: (els) => {
      gsap.from(els, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "expo.out",
        clearProps: "all",
      });
    },
    once: true,
  });
}
