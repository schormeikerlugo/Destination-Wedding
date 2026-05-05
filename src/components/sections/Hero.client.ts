import { gsap, registerGsap } from "@lib/gsap";
import { prefersReducedMotion } from "@lib/reduced-motion";

registerGsap();

if (!prefersReducedMotion()) {
  // Entry timeline
  const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.2 });

  // Only animate the first (active) slide on entry to avoid conflicting with the cross-fade
  tl.from('[data-hero-slide][data-index="0"]', {
    scale: 1.08,
    duration: 1.6,
    ease: "expo.out",
  });

  tl.from(
    "[data-hero-eyebrow], [data-hero-location]",
    { y: 14, opacity: 0, duration: 0.9, stagger: 0.08 },
    "-=1.0"
  );

  tl.from(
    "[data-hero-title] .hero__title-line > span",
    { yPercent: 110, opacity: 0, duration: 1.2, stagger: 0.1 },
    "-=0.8"
  );

  tl.from(
    "[data-hero-lead] > *",
    { y: 20, opacity: 0, duration: 0.9, stagger: 0.08 },
    "-=0.7"
  );

  tl.from(
    "[data-hero-scroll]",
    { y: 14, opacity: 0, duration: 0.7 },
    "-=0.5"
  );

  // Loops + parallax
  const mm = gsap.matchMedia();
  mm.add("(min-width: 720px)", () => {
    // Photo parallax — applies to all stacked slides so the active one always drifts
    gsap.to("[data-hero-media] .hero__media-img", {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      },
    });
  });

  // Pointer-follow on the title — subtle parallax
  mm.add("(min-width: 720px) and (hover: hover) and (pointer: fine)", () => {
    const title = document.querySelector<HTMLElement>("[data-hero-title]");
    if (!title) return;

    const MAX = 12;
    const xTo = gsap.quickTo(title, "x", { duration: 1.1, ease: "power3.out" });
    const yTo = gsap.quickTo(title, "y", { duration: 1.2, ease: "power3.out" });

    let frame = 0;
    let pendingX = 0;
    let pendingY = 0;

    const onMove = (e: PointerEvent) => {
      pendingX = (e.clientX / window.innerWidth) * 2 - 1;
      pendingY = (e.clientY / window.innerHeight) * 2 - 1;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        xTo(pendingX * MAX);
        yTo(pendingY * MAX * 0.6);
      });
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  });
}

// =========================================================
// Hero carousel — cross-fade between slides every 6s.
// Pauses while the tab is hidden. Disabled if user prefers reduced motion.
// =========================================================
{
  const slides = Array.from(
    document.querySelectorAll<HTMLImageElement>("[data-hero-slide]")
  );

  if (slides.length > 1 && !prefersReducedMotion()) {
    const ACTIVE = "hero__media-img--active";
    const INTERVAL_MS = 6000;
    let current = slides.findIndex((el) => el.classList.contains(ACTIVE));
    if (current < 0) current = 0;

    let timerId: number | null = null;

    const advance = () => {
      const next = (current + 1) % slides.length;
      const a = slides[current];
      const b = slides[next];
      a.classList.remove(ACTIVE);
      a.setAttribute("aria-hidden", "true");
      b.classList.add(ACTIVE);
      b.setAttribute("aria-hidden", "false");
      current = next;
    };

    const start = () => {
      if (timerId !== null) return;
      timerId = window.setInterval(advance, INTERVAL_MS);
    };

    const stop = () => {
      if (timerId === null) return;
      clearInterval(timerId);
      timerId = null;
    };

    start();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    // Cleanup on Astro view transitions / SPA-like navigation
    document.addEventListener(
      "astro:before-swap",
      () => stop(),
      { once: true }
    );
  }
}
