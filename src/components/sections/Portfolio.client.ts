import { gsap, ScrollTrigger, registerGsap } from "@lib/gsap";
import { prefersReducedMotion } from "@lib/reduced-motion";

registerGsap();

const reduce = prefersReducedMotion();
const sectionEl = document.querySelector<HTMLElement>(".portfolio");

if (sectionEl) {
  initPortfolio(sectionEl);
}

function initPortfolio(section: HTMLElement) {
  // Items can live inside per-column wrappers; we sort by their global
  // data-index so the expand/collapse logic shows/hides the right ones.
  const items = Array.from(
    section.querySelectorAll<HTMLElement>(".portfolio__item"),
  ).sort(
    (a, b) =>
      Number(a.dataset.index ?? "0") - Number(b.dataset.index ?? "0"),
  );
  const toggle = section.querySelector<HTMLButtonElement>(
    "[data-portfolio-toggle]",
  );
  const toggleLabel = toggle?.querySelector<HTMLElement>(
    "[data-portfolio-toggle-label]",
  );
  const toggleMeta = section.querySelector<HTMLElement>(
    "[data-portfolio-toggle-meta]",
  );
  const total = items.length;

  // Captura el set de items que arrancan con data-hidden="true" en el SSR.
  // Esos son los que el botón "Show more" debe mostrar/ocultar.
  const hiddenInitially = items.filter(
    (el) => el.getAttribute("data-hidden") === "true",
  );
  const visibleInitiallyCount = total - hiddenInitially.length;

  /* ---------- Reveal del título ---------- */
  if (!reduce) {
    gsap.from("[data-portfolio-title] .portfolio__title-line > span", {
      yPercent: 110,
      opacity: 0,
      duration: 1.1,
      stagger: 0.1,
      ease: "expo.out",
      scrollTrigger: {
        trigger: "[data-portfolio-title]",
        start: "top 85%",
        once: true,
      },
    });

    /* Reveal de items visibles iniciales en batch */
    const initialItems = items.filter(
      (el) => el.getAttribute("data-hidden") !== "true",
    );
    ScrollTrigger.batch(initialItems, {
      start: "top 92%",
      onEnter: (els) => {
        gsap.from(els, {
          y: 28,
          opacity: 0,
          duration: 0.9,
          stagger: 0.04,
          ease: "expo.out",
          clearProps: "all",
        });
      },
      once: true,
    });
  }

  /* ---------- Expand / Collapse ---------- */
  let expanded = false;

  function setExpanded(next: boolean) {
    expanded = next;

    if (next) {
      hiddenInitially.forEach((el) => el.removeAttribute("data-hidden"));
      if (!reduce) {
        gsap.from(hiddenInitially, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          stagger: 0.02,
          ease: "expo.out",
          clearProps: "all",
          onComplete: () => ScrollTrigger.refresh(),
        });
      } else {
        ScrollTrigger.refresh();
      }
    } else {
      hiddenInitially.forEach((el) =>
        el.setAttribute("data-hidden", "true"),
      );
      ScrollTrigger.refresh();
      const top =
        section.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }

    if (toggle) {
      toggle.setAttribute("aria-expanded", String(next));
    }
    if (toggleLabel) {
      toggleLabel.textContent = next
        ? "Show less"
        : `Show all ${total} photos`;
    }
    if (toggleMeta) {
      toggleMeta.textContent = next
        ? `Showing all ${total} photographs`
        : `Showing ${visibleInitiallyCount} of ${total}`;
    }
  }

  toggle?.addEventListener("click", () => setExpanded(!expanded));

  /* ---------- Lightbox ---------- */
  const lightbox = section.querySelector<HTMLElement>(
    "[data-portfolio-lightbox]",
  );
  const lbImg = section.querySelector<HTMLImageElement>(
    "[data-portfolio-lightbox-img]",
  );
  const lbCaption = section.querySelector<HTMLElement>(
    "[data-portfolio-lightbox-caption]",
  );
  const lbClose = section.querySelector<HTMLElement>(
    "[data-portfolio-lightbox-close]",
  );
  const lbPrev = section.querySelector<HTMLElement>(
    "[data-portfolio-lightbox-prev]",
  );
  const lbNext = section.querySelector<HTMLElement>(
    "[data-portfolio-lightbox-next]",
  );
  const pool = Array.from(
    section.querySelectorAll<HTMLImageElement>("[data-portfolio-pool-index]"),
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

  function openLb(index: number) {
    if (!lightbox || !lbImg || !lbCaption || !pool.length) return;
    current = (index + pool.length) % pool.length;
    const sourceImg = pool[current];
    if (!sourceImg) return;

    lbImg.src = bestSrcFor(sourceImg);
    lbImg.alt = sourceImg.alt ?? "";
    lbCaption.textContent = `${current + 1} / ${pool.length}`;

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLb() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  section
    .querySelectorAll<HTMLButtonElement>("[data-portfolio-trigger]")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest<HTMLElement>(".portfolio__item");
        if (!item) return;
        const idx = Number(item.dataset.index ?? "0");
        openLb(idx);
      });
    });

  lbClose?.addEventListener("click", closeLb);
  lbPrev?.addEventListener("click", () => openLb(current - 1));
  lbNext?.addEventListener("click", () => openLb(current + 1));
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLb();
  });

  window.addEventListener("keydown", (e) => {
    if (!lightbox?.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLb();
    else if (e.key === "ArrowLeft") openLb(current - 1);
    else if (e.key === "ArrowRight") openLb(current + 1);
  });
}
