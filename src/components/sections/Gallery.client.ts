import { gsap, ScrollTrigger, registerGsap } from "@lib/gsap";
import { prefersReducedMotion } from "@lib/reduced-motion";

registerGsap();

const reduce = prefersReducedMotion();
const items = Array.from(document.querySelectorAll<HTMLElement>(".work__item"));

if (!reduce) {
  gsap.from("[data-work-title] .work__title-line > span", {
    yPercent: 110,
    opacity: 0,
    duration: 1.1,
    stagger: 0.1,
    ease: "expo.out",
    scrollTrigger: { trigger: "[data-work-title]", start: "top 85%", once: true },
  });

  ScrollTrigger.batch(items, {
    start: "top 90%",
    onEnter: (els) => {
      gsap.from(els, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.06,
        ease: "expo.out",
        clearProps: "all",
      });
    },
    once: true,
  });
}

/* Lightbox — supports the full pool of images, not just the 9 featured */
const lightbox = document.querySelector<HTMLElement>("[data-lightbox]");
const lbImg = document.querySelector<HTMLImageElement>("[data-lightbox-img]");
const lbCaption = document.querySelector<HTMLElement>("[data-lightbox-caption]");
const lbClose = document.querySelector<HTMLElement>("[data-lightbox-close]");
const lbPrev = document.querySelector<HTMLElement>("[data-lightbox-prev]");
const lbNext = document.querySelector<HTMLElement>("[data-lightbox-next]");

const pool = Array.from(
  document.querySelectorAll<HTMLImageElement>("[data-pool-index]")
);

let current = 0;

function bestSrcFor(img: HTMLImageElement): string {
  const srcset = img.getAttribute("srcset");
  let bestSrc = img.getAttribute("src") ?? "";
  if (srcset) {
    const candidates = srcset
      .split(",")
      .map((s) => s.trim())
      .map((s) => {
        const [url, w] = s.split(" ");
        return { url, w: parseInt(w ?? "0", 10) };
      })
      .sort((a, b) => b.w - a.w);
    if (candidates.length && candidates[0]) bestSrc = candidates[0].url;
  }
  return bestSrc;
}

function open(index: number) {
  if (!lightbox || !lbImg || !lbCaption || !pool.length) return;
  current = (index + pool.length) % pool.length;
  const sourceImg = pool[current];
  if (!sourceImg) return;

  lbImg.src = bestSrcFor(sourceImg);
  lbImg.alt = sourceImg.alt ?? "";
  const caption = sourceImg.dataset.poolCaption ?? "";
  const moment = sourceImg.dataset.poolMoment ?? "";
  lbCaption.textContent = caption ? `${caption} · ${moment}` : moment;

  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function close() {
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll<HTMLButtonElement>("[data-lightbox-trigger]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest<HTMLElement>(".work__item");
    if (!item) return;
    const idx = Number(item.dataset.index ?? "0");
    open(idx);
  });
});

lbClose?.addEventListener("click", close);
lbPrev?.addEventListener("click", () => open(current - 1));
lbNext?.addEventListener("click", () => open(current + 1));
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) close();
});

window.addEventListener("keydown", (e) => {
  if (!lightbox?.classList.contains("is-open")) return;
  if (e.key === "Escape") close();
  else if (e.key === "ArrowLeft") open(current - 1);
  else if (e.key === "ArrowRight") open(current + 1);
});
