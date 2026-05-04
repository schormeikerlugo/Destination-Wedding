import { gsap, ScrollTrigger, registerGsap } from "@lib/gsap";
import { prefersReducedMotion } from "@lib/reduced-motion";

registerGsap();

const reduce = prefersReducedMotion();

if (!reduce) {
  gsap.from("[data-about-title] .about__title-line > span", {
    yPercent: 110,
    opacity: 0,
    duration: 1.1,
    stagger: 0.1,
    ease: "expo.out",
    scrollTrigger: { trigger: "[data-about-title]", start: "top 80%", once: true },
  });

  gsap.from("[data-about-portrait]", {
    y: 50,
    opacity: 0,
    duration: 1.1,
    ease: "expo.out",
    scrollTrigger: { trigger: "[data-about-portrait]", start: "top 85%", once: true },
  });

  gsap.from("[data-about-copy] > *", {
    y: 24,
    opacity: 0,
    duration: 0.9,
    stagger: 0.08,
    ease: "expo.out",
    scrollTrigger: { trigger: "[data-about-copy]", start: "top 80%", once: true },
  });
}

// Stats counter
const counters = document.querySelectorAll<HTMLElement>("[data-counter]");
counters.forEach((el) => {
  const target = Number(el.dataset.counterTarget ?? "0");
  const suffix = el.dataset.counterSuffix ?? "";

  if (reduce) {
    el.textContent = `${target}${suffix}`;
    return;
  }

  const obj = { v: 0 };
  ScrollTrigger.create({
    trigger: el,
    start: "top 88%",
    once: true,
    onEnter: () => {
      gsap.to(obj, {
        v: target,
        duration: 1.6,
        ease: "expo.out",
        onUpdate: () => {
          el.textContent = `${Math.round(obj.v)}${suffix}`;
        },
      });
    },
  });
});
