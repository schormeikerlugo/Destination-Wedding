export const site = {
  name: "Destination Wedding",
  brand: "Destination Wedding",
  founder: "Kathrin Ledwon",
  tagline: "Editorial Wedding Experiences",
  description:
    "Destination Wedding — editorial wedding experiences captured worldwide. Photography by Kathrin Ledwon, award-winning destination wedding photographer.",
  url: "https://destinationwedding.com",
  email: "hello@destinationwedding.com",
  location: "Based worldwide · Available globally",
  yearStart: 2016,
  cta: {
    label: "Plan Your Wedding",
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
    { id: "craft", label: "Craft" },
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
