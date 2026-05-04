export const site = {
  name: "Kathrin Ledwon",
  brand: "kathrin.®",
  tagline: "Destination Wedding Photography",
  description:
    "Award-winning destination wedding photographer capturing timeless, emotional, and authentic love stories across the globe.",
  url: "https://kathrinledwon.com",
  email: "hello@kathrinledwon.com",
  location: "Based worldwide · Available globally",
  yearStart: 2016,
  cta: {
    label: "Start a Project",
    href: "#cta",
  },
  social: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Pinterest", href: "https://pinterest.com/" },
    { label: "Vimeo", href: "https://vimeo.com/" },
  ],
  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Studio", href: "#studio" },
    { label: "Investment", href: "#investment" },
  ],
  /** Scroll-spy sections shown in PageIndex */
  pageIndex: [
    { id: "hero", label: "Intro" },
    { id: "manifest", label: "Manifest" },
    { id: "about", label: "About" },
    { id: "studio", label: "Studio" },
    { id: "work", label: "Work" },
    { id: "investment", label: "Investment" },
    { id: "faq", label: "FAQ" },
    { id: "cta", label: "Connect" },
  ],
  stats: [
    { value: 10, suffix: "+", label: "Years documenting love" },
    { value: 200, suffix: "+", label: "Weddings captured" },
    { value: 6, suffix: "", label: "Continents covered" },
  ],
} as const;

export type SiteConfig = typeof site;
