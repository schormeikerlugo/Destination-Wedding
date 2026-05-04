import type { ImageMetadata } from "astro";

import europeImg from "@assets/galeria/04-portrait-couple-light.jpg";
import naImg from "@assets/galeria/02-portrait-couple.jpg";
import saImg from "@assets/galeria/05-portrait-couple-embrace.jpg";
import asiaImg from "@assets/galeria/09-ceremony-vertical.jpg";
import africaImg from "@assets/galeria/16-landscape-venue.jpg";
import oceaniaImg from "@assets/galeria/18-aerial-landscape.jpg";

export type Package = {
  id: string;
  region: string;
  price: string;
  priceFrom?: boolean;
  destinations: string[];
  blurb: string;
  image: ImageMetadata;
  imageAlt: string;
};

export const packages: Package[] = [
  {
    id: "europe",
    region: "Europe",
    price: "$5,000",
    priceFrom: true,
    destinations: ["Paris", "Santorini", "Lake Como", "Barcelona", "Amalfi Coast"],
    blurb: "Old-world romance, sunlit villas, intimate coastal ceremonies.",
    image: europeImg,
    imageAlt: "Couple in soft golden light evoking European romance",
  },
  {
    id: "north-america",
    region: "North America",
    price: "$10,000",
    destinations: ["New York", "Los Angeles", "Tulum", "Banff", "Napa Valley"],
    blurb: "Skylines, deserts and coastline — bold, modern love stories.",
    image: naImg,
    imageAlt: "Contemporary couple portrait",
  },
  {
    id: "south-america",
    region: "South America",
    price: "$7,500",
    destinations: ["Rio de Janeiro", "Buenos Aires", "Cartagena", "Patagonia", "Lima"],
    blurb: "Vibrant colour, cinematic landscapes, soulful celebrations.",
    image: saImg,
    imageAlt: "Couple in warm embrace, soulful tone",
  },
  {
    id: "asia",
    region: "Asia",
    price: "$7,500",
    destinations: ["Bali", "Phuket", "Kyoto", "Maldives", "Sri Lanka"],
    blurb: "Tropical light, ancient temples, ocean horizons.",
    image: asiaImg,
    imageAlt: "Vertical ceremony moment",
  },
  {
    id: "africa",
    region: "Africa",
    price: "$7,000",
    destinations: ["Cape Town", "Marrakech", "Zanzibar", "Seychelles", "Namibia"],
    blurb: "Golden hours, raw landscapes, weddings with a sense of awe.",
    image: africaImg,
    imageAlt: "Wide landscape venue with dramatic horizon",
  },
  {
    id: "oceania",
    region: "Australia & New Zealand",
    price: "$8,000",
    destinations: ["Sydney", "Melbourne", "Queenstown", "Auckland", "Byron Bay"],
    blurb: "Coast to alpine — wide-open vistas and grounded elegance.",
    image: oceaniaImg,
    imageAlt: "Aerial landscape evoking wide-open vistas",
  },
];
