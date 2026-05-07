import type { ImageMetadata } from "astro";

import europeImg from "@assets/galeria/19-package-europe.jpg";
import naImg from "@assets/galeria/20-package-north-america.jpg";
import saImg from "@assets/galeria/21-package-south-america.jpg";
import asiaImg from "@assets/galeria/22-package-asia.jpg";
import africaImg from "@assets/galeria/23-package-africa.jpg";
import oceaniaImg from "@assets/galeria/24-package-oceania.jpg";

export type Package = {
  id: string;
  /** Short tier label, e.g. "Type 01" */
  tier: string;
  region: string;
  price: string;
  /** Optional small label after the price, e.g. "per day", "starting from" */
  priceUnit?: string;
  priceFrom?: boolean;
  destinations: string[];
  blurb: string;
  image: ImageMetadata;
  imageAlt: string;
  /** When true, this card gets the highlighted treatment (border accent + tag) */
  featured?: boolean;
  /** Tag shown on featured cards (e.g. "Most Popular") */
  featuredLabel?: string;
};

export const packages: Package[] = [
  {
    id: "europe",
    tier: "Type 01",
    region: "Europe",
    price: "$5,000",
    priceUnit: "starting from",
    priceFrom: true,
    destinations: ["Paris", "Santorini", "Lake Como", "Barcelona", "Amalfi Coast"],
    blurb:
      "Old-world romance, sunlit villas and intimate coastal ceremonies. Editorial coverage, hand-crafted edits and a private gallery included.",
    image: europeImg,
    imageAlt: "Couple in soft golden light evoking European romance",
  },
  {
    id: "north-america",
    tier: "Type 02",
    region: "North America",
    price: "$10,000",
    priceUnit: "starting from",
    destinations: ["New York", "Los Angeles", "Tulum", "Banff", "Napa Valley"],
    blurb:
      "Skylines, deserts and coastline — bold, modern love stories. Multi-day coverage with a second shooter and full editorial deliverables.",
    image: naImg,
    imageAlt: "Contemporary couple portrait",
    featured: true,
    featuredLabel: "Most Popular",
  },
  {
    id: "south-america",
    tier: "Type 03",
    region: "South America",
    price: "$7,500",
    priceUnit: "starting from",
    destinations: ["Rio de Janeiro", "Buenos Aires", "Cartagena", "Patagonia", "Lima"],
    blurb:
      "Vibrant colour, cinematic landscapes and soulful celebrations. Includes pre-wedding portrait session and tailored editorial gallery.",
    image: saImg,
    imageAlt: "Couple in warm embrace, soulful tone",
  },
  {
    id: "asia",
    tier: "Type 04",
    region: "Asia",
    price: "$7,500",
    priceUnit: "starting from",
    destinations: ["Bali", "Phuket", "Kyoto", "Maldives", "Sri Lanka"],
    blurb:
      "Tropical light, ancient temples and ocean horizons. Two-day coverage with travel built in and bespoke aerial perspectives.",
    image: asiaImg,
    imageAlt: "Vertical ceremony moment",
  },
  {
    id: "africa",
    tier: "Type 05",
    region: "Africa",
    price: "$7,000",
    priceUnit: "starting from",
    destinations: ["Cape Town", "Marrakech", "Zanzibar", "Seychelles", "Namibia"],
    blurb:
      "Golden hours, raw landscapes and weddings with a sense of awe. Documentary-led coverage paired with editorial portraiture.",
    image: africaImg,
    imageAlt: "Wide landscape venue with dramatic horizon",
  },
  {
    id: "oceania",
    tier: "Type 06",
    region: "Australia & New Zealand",
    price: "$8,000",
    priceUnit: "starting from",
    destinations: ["Sydney", "Melbourne", "Queenstown", "Auckland", "Byron Bay"],
    blurb:
      "Coast to alpine — wide-open vistas and grounded elegance. Includes location scouting and full editorial gallery delivery.",
    image: oceaniaImg,
    imageAlt: "Aerial landscape evoking wide-open vistas",
  },
];
