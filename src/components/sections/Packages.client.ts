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
    scrollTrigger: { trigger: "[data-invest-title]", start: "top 85%", once: true },
  });

  gsap.from("[data-row]", {
    y: 24,
    opacity: 0,
    duration: 0.8,
    stagger: 0.06,
    ease: "expo.out",
    scrollTrigger: { trigger: "[data-invest-table]", start: "top 80%", once: true },
  });
}

// Accordion
const rows = document.querySelectorAll<HTMLElement>("[data-row]");

rows.forEach((row) => {
  const btn = row.querySelector<HTMLButtonElement>("[data-row-toggle]");
  const panel = row.querySelector<HTMLElement>("[data-row-panel]");
  if (!btn || !panel) return;

  panel.style.height = "0";

  btn.addEventListener("click", () => {
    const isOpen = row.classList.contains("is-open");
    const inner = panel.firstElementChild as HTMLElement | null;
    if (!inner) return;

    if (isOpen) {
      panel.style.height = `${panel.scrollHeight}px`;
      requestAnimationFrame(() => {
        row.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        if (reduce) {
          panel.style.height = "0";
        } else {
          gsap.to(panel, { height: 0, duration: 0.5, ease: "expo.out" });
        }
      });
    } else {
      row.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      const target = inner.scrollHeight;
      if (reduce) {
        panel.style.height = "auto";
      } else {
        gsap.to(panel, {
          height: target,
          duration: 0.55,
          ease: "expo.out",
          onComplete: () => {
            panel.style.height = "auto";
          },
        });
      }
    }
  });
});
