export type Package = {
  id: string;
  region: string;
  price: string;
  priceFrom?: boolean;
  destinations: string[];
  blurb: string;
};

export const packages: Package[] = [
  {
    id: "europe",
    region: "Europe",
    price: "$5,000",
    priceFrom: true,
    destinations: ["Paris", "Santorini", "Lake Como", "Barcelona", "Amalfi Coast"],
    blurb: "Old-world romance, sunlit villas, intimate coastal ceremonies.",
  },
  {
    id: "north-america",
    region: "North America",
    price: "$10,000",
    destinations: ["New York", "Los Angeles", "Tulum", "Banff", "Napa Valley"],
    blurb: "Skylines, deserts and coastline — bold, modern love stories.",
  },
  {
    id: "south-america",
    region: "South America",
    price: "$7,500",
    destinations: ["Rio de Janeiro", "Buenos Aires", "Cartagena", "Patagonia", "Lima"],
    blurb: "Vibrant colour, cinematic landscapes, soulful celebrations.",
  },
  {
    id: "asia",
    region: "Asia",
    price: "$7,500",
    destinations: ["Bali", "Phuket", "Kyoto", "Maldives", "Sri Lanka"],
    blurb: "Tropical light, ancient temples, ocean horizons.",
  },
  {
    id: "africa",
    region: "Africa",
    price: "$7,000",
    destinations: ["Cape Town", "Marrakech", "Zanzibar", "Seychelles", "Namibia"],
    blurb: "Golden hours, raw landscapes, weddings with a sense of awe.",
  },
  {
    id: "oceania",
    region: "Australia & New Zealand",
    price: "$8,000",
    destinations: ["Sydney", "Melbourne", "Queenstown", "Auckland", "Byron Bay"],
    blurb: "Coast to alpine — wide-open vistas and grounded elegance.",
  },
];
