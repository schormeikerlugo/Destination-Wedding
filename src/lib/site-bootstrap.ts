import { initLenis } from "./lenis";
import { registerGsap, ScrollTrigger } from "./gsap";

export function bootstrapSite(): void {
  if (typeof window === "undefined") return;

  registerGsap();
  initLenis();

  // Refresh ScrollTrigger when fonts have loaded so triggers measure correctly.
  if ("fonts" in document) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());
}
