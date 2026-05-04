import { gsap, registerGsap } from "@lib/gsap";
import { prefersReducedMotion } from "@lib/reduced-motion";

registerGsap();

if (!prefersReducedMotion()) {
  // Entry timeline
  const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.2 });

  tl.from("[data-hero-media] .hero__media-img", {
    scale: 1.08,
    opacity: 0,
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
    // Photo parallax — subtle vertical drift while scrolling
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
