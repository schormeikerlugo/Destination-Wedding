import { gsap, registerGsap } from "@lib/gsap";
import { prefersReducedMotion } from "@lib/reduced-motion";

registerGsap();

const reduce = prefersReducedMotion();
const items = Array.from(document.querySelectorAll<HTMLElement>("[data-faq-item]"));

function setOpen(item: HTMLElement, open: boolean) {
  const btn = item.querySelector<HTMLButtonElement>("[data-faq-toggle]");
  const panel = item.querySelector<HTMLElement>("[data-faq-panel]");
  if (!btn || !panel) return;

  item.classList.toggle("is-open", open);
  btn.setAttribute("aria-expanded", String(open));

  const inner = panel.firstElementChild as HTMLElement | null;
  if (!inner) return;

  if (reduce) {
    panel.style.height = open ? "auto" : "0";
    return;
  }

  const target = open ? inner.scrollHeight : 0;
  gsap.to(panel, {
    height: target,
    duration: 0.55,
    ease: "expo.out",
    onComplete: () => {
      if (open) panel.style.height = "auto";
    },
  });
}

items.forEach((item) => {
  const btn = item.querySelector<HTMLButtonElement>("[data-faq-toggle]");
  const panel = item.querySelector<HTMLElement>("[data-faq-panel]");
  if (!btn || !panel) return;

  panel.style.height = item.classList.contains("is-open") ? "auto" : "0";

  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");
    if (isOpen) {
      panel.style.height = `${panel.scrollHeight}px`;
      requestAnimationFrame(() => setOpen(item, false));
    } else {
      setOpen(item, true);
    }
  });
});

if (!reduce) {
  gsap.from("[data-faq-title] .faq__title-line > span", {
    yPercent: 110,
    opacity: 0,
    duration: 1.1,
    stagger: 0.1,
    ease: "expo.out",
    scrollTrigger: { trigger: "[data-faq-title]", start: "top 85%", once: true },
  });

  gsap.from(items, {
    y: 24,
    opacity: 0,
    duration: 0.7,
    stagger: 0.05,
    ease: "expo.out",
    scrollTrigger: { trigger: "[data-faq-list]", start: "top 85%", once: true },
  });
}
