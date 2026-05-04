import { gsap, registerGsap } from "@lib/gsap";
import { prefersReducedMotion } from "@lib/reduced-motion";

registerGsap();

if (!prefersReducedMotion()) {
  gsap.from("[data-cta-title] [data-word]", {
    yPercent: 110,
    opacity: 0,
    duration: 1.1,
    stagger: 0.07,
    ease: "expo.out",
    scrollTrigger: { trigger: "[data-cta-title]", start: "top 80%", once: true },
  });

  gsap.from(".cta-final__bottom > *", {
    y: 18,
    opacity: 0,
    duration: 0.8,
    stagger: 0.08,
    ease: "expo.out",
    scrollTrigger: { trigger: ".cta-final__bottom", start: "top 90%", once: true },
  });
}
