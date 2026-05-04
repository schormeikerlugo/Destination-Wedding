import { gsap, registerGsap } from "@lib/gsap";
import { prefersReducedMotion } from "@lib/reduced-motion";

registerGsap();

if (!prefersReducedMotion()) {
  gsap.from("[data-studio-title] .studio__title-line > span", {
    yPercent: 110,
    opacity: 0,
    duration: 1.1,
    stagger: 0.1,
    ease: "expo.out",
    scrollTrigger: { trigger: "[data-studio-title]", start: "top 80%", once: true },
  });

  gsap.from(".studio__media, .studio__copy .t-body, .studio__copy .pill", {
    y: 24,
    opacity: 0,
    duration: 0.9,
    stagger: 0.08,
    ease: "expo.out",
    scrollTrigger: { trigger: ".studio", start: "top 75%", once: true },
  });
}

// Reel modal
const reel = document.querySelector<HTMLElement>("[data-reel]");
const reelOpenButtons = document.querySelectorAll<HTMLButtonElement>("[data-reel-open]");
const reelCloseBtn = document.querySelector<HTMLButtonElement>("[data-reel-close]");
const reelVideo = document.querySelector<HTMLVideoElement>("[data-reel-video]");

function openReel() {
  if (!reel || !reelVideo) return;
  reel.classList.add("is-open");
  reel.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  reelVideo.currentTime = 0;
  void reelVideo.play().catch(() => {});
}

function closeReel() {
  if (!reel || !reelVideo) return;
  reel.classList.remove("is-open");
  reel.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  reelVideo.pause();
}

reelOpenButtons.forEach((b) => b.addEventListener("click", openReel));
reelCloseBtn?.addEventListener("click", closeReel);
reel?.addEventListener("click", (e) => {
  if (e.target === reel) closeReel();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && reel?.classList.contains("is-open")) closeReel();
});
