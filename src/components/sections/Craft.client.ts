import { gsap, registerGsap } from "@lib/gsap";
import { prefersReducedMotion } from "@lib/reduced-motion";

registerGsap();

if (!prefersReducedMotion()) {
  // Entry timeline — triggered when section enters viewport
  const tl = gsap.timeline({
    defaults: { ease: "expo.out" },
    scrollTrigger: {
      trigger: ".craft",
      start: "top 70%",
      once: true,
    },
  });

  tl.from("[data-craft-top-l], [data-craft-top-r]", {
    y: 16,
    opacity: 0,
    duration: 0.8,
    stagger: 0.05,
  });

  tl.from(
    "[data-craft-title] .craft__title-line > span",
    { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.08 },
    "-=0.5"
  );

  tl.from(
    "[data-craft-lead] .craft__sub, [data-craft-lead] .craft__badges li",
    { y: 16, opacity: 0, duration: 0.7, stagger: 0.06 },
    "-=0.6"
  );

  tl.from(
    "[data-craft-camera] .craft__camera-img",
    { y: 50, opacity: 0, scale: 0.94, rotate: -10, duration: 1.4 },
    "-=0.9"
  );

  tl.from(
    "[data-craft-camera] .craft__camera-tag",
    { y: 14, opacity: 0, duration: 0.7, stagger: 0.1 },
    "-=0.7"
  );

  tl.from(
    "[data-craft-index] > *",
    { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 },
    "-=0.8"
  );

  tl.from(
    "[data-craft-player], [data-craft-scroll]",
    { y: 14, opacity: 0, duration: 0.7, stagger: 0.07 },
    "-=0.5"
  );

  // Background reveals — appear last so they don't compete with hero entry
  tl.from(
    ".craft__grid-v, .craft__grid-h",
    { scaleY: 0, scaleX: 0, opacity: 0, duration: 1.4, stagger: 0.08, transformOrigin: "center" },
    0.2
  );

  tl.from(
    "[data-craft-ring-1], [data-craft-ring-2], [data-craft-ring-3]",
    { scale: 0.7, opacity: 0, duration: 1.6, stagger: 0.12 },
    0.3
  );

  tl.from(
    "[data-craft-crosshair]",
    { scale: 0.8, opacity: 0, duration: 1.4 },
    0.5
  );

  // Loops
  const mm = gsap.matchMedia();
  mm.add("(min-width: 720px)", () => {
    // Sphere drift
    gsap.to("[data-craft-sphere-1]", {
      x: 50, y: -30, duration: 36, repeat: -1, yoyo: true, ease: "sine.inOut",
    });
    gsap.to("[data-craft-sphere-2]", {
      x: -60, y: 40, duration: 44, repeat: -1, yoyo: true, ease: "sine.inOut",
    });

    // Aperture rings — slow breathing
    [1, 2, 3].forEach((n, i) => {
      gsap.to(`[data-craft-ring-${n}]`, {
        scale: 1.025,
        duration: 6 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "center center",
      });
    });

    // Crosshair very slow rotation
    gsap.to("[data-craft-crosshair]", {
      rotation: 360,
      duration: 90,
      repeat: -1,
      ease: "none",
      transformOrigin: "center center",
    });

    // Camera parallax + subtle tilt with scroll
    gsap.to("[data-craft-camera] .craft__camera-img", {
      yPercent: 14,
      rotate: -1,
      ease: "none",
      scrollTrigger: {
        trigger: ".craft",
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      },
    });

    // Aperture rings drift slightly with scroll
    gsap.to("[data-craft-ring-3]", {
      scale: 1.1,
      opacity: 0.4,
      ease: "none",
      scrollTrigger: {
        trigger: ".craft",
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
      },
    });
  });

  // Float idle on camera
  gsap.to("[data-craft-camera] .craft__camera-img", {
    y: -8,
    duration: 4,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    delay: 1.6,
  });

  // Pointer-follow on camera — subtle parallax tied to cursor position.
  // Uses gsap.quickTo for performant tween writes (no per-frame allocations).
  mm.add("(min-width: 720px) and (hover: hover) and (pointer: fine)", () => {
    // Apply pointer follow to the figure wrapper so it composes with the
    // existing image animations (float idle, scroll parallax) without
    // overwriting their transform values. Tags inside the figure inherit
    // the movement automatically.
    const cameraWrap = document.querySelector<HTMLElement>("[data-craft-camera]");
    const crosshair = document.querySelector<HTMLElement>("[data-craft-crosshair]");
    if (!cameraWrap) return;

    // Max travel in pixels (subtle: ±20px X, ±14px Y) and rotation (±1.5deg).
    const MAX_X = 20;
    const MAX_Y = 14;
    const MAX_R = 1.5;

    // Interpolated setters — duration/ease control the "easing" follow.
    const xTo = gsap.quickTo(cameraWrap, "x", { duration: 1.1, ease: "power3.out" });
    const yTo = gsap.quickTo(cameraWrap, "y", { duration: 1.1, ease: "power3.out" });
    const rTo = gsap.quickTo(cameraWrap, "rotation", { duration: 1.3, ease: "power3.out" });

    // Crosshair gets the gentlest movement to feel like the focus point shifts.
    // It already has a slow rotation loop; the X/Y shift composes additively.
    const crossX = crosshair
      ? gsap.quickTo(crosshair, "x", { duration: 1.6, ease: "power3.out" })
      : null;
    const crossY = crosshair
      ? gsap.quickTo(crosshair, "y", { duration: 1.6, ease: "power3.out" })
      : null;

    let frame = 0;
    let pendingX = 0;
    let pendingY = 0;

    const onMove = (e: PointerEvent) => {
      // Normalised position from -1 to 1 relative to viewport center.
      pendingX = (e.clientX / window.innerWidth) * 2 - 1;
      pendingY = (e.clientY / window.innerHeight) * 2 - 1;

      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        xTo(pendingX * MAX_X);
        yTo(pendingY * MAX_Y);
        rTo(pendingX * MAX_R);
        crossX?.(pendingX * 8);
        crossY?.(pendingY * 6);
      });
    };

    // Reset to origin when pointer leaves the window.
    const onLeave = () => {
      xTo(0);
      yTo(0);
      rTo(0);
      crossX?.(0);
      crossY?.(0);
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

// Wire reel shortcut button(s) inside this section to the Studio reel modal.
document
  .querySelectorAll<HTMLButtonElement>(".craft [data-reel-shortcut]")
  .forEach((btn) => {
    btn.addEventListener("click", () => {
      const studioBtn = document.querySelector<HTMLButtonElement>("[data-reel-open]");
      studioBtn?.click();
    });
  });
