import type { ImageMetadata } from "astro";

import img01 from "@assets/galeria/01-portrait-bride.jpg";
import img02 from "@assets/galeria/02-portrait-couple.jpg";
import img03 from "@assets/galeria/03-portrait-bride-veil.jpg";
import img04 from "@assets/galeria/04-portrait-couple-light.jpg";
import img05 from "@assets/galeria/05-portrait-couple-embrace.jpg";
import img06 from "@assets/galeria/06-portrait-couple-window.jpg";
import img07 from "@assets/galeria/07-portrait-couple-walk.jpg";
import img08 from "@assets/galeria/08-portrait-bride-getting-ready.jpg";
import img09 from "@assets/galeria/09-ceremony-vertical.jpg";
import img10 from "@assets/galeria/10-ceremony-wide.jpg";
import img11 from "@assets/galeria/11-ceremony-portrait.jpg";
import img12 from "@assets/galeria/12-reception-wide.jpg";
import img13 from "@assets/galeria/13-reception-vertical.jpg";
import img14 from "@assets/galeria/14-detail-rings.jpg";
import img15 from "@assets/galeria/15-detail-vertical.jpg";
import img16 from "@assets/galeria/16-landscape-venue.jpg";
import img17 from "@assets/galeria/17-aerial-vertical.jpg";
import img18 from "@assets/galeria/18-aerial-landscape.jpg";

export type GalleryMoment =
  | "Portraits"
  | "Ceremony"
  | "Reception"
  | "Details"
  | "Landscapes"
  | "Aerial";

export type GalleryRatio = "portrait" | "landscape" | "square";

export type GalleryImage = {
  image: ImageMetadata;
  alt: string;
  caption: string;
  moment: GalleryMoment;
  ratio: GalleryRatio;
};

export const galleryMoments = [
  "All",
  "Portraits",
  "Ceremony",
  "Reception",
  "Details",
  "Landscapes",
  "Aerial",
] as const;

export const gallery: GalleryImage[] = [
  { image: img01, alt: "Bride portrait in soft natural light", caption: "Quiet moments before the vows", moment: "Portraits", ratio: "portrait" },
  { image: img02, alt: "Couple holding each other", caption: "First look", moment: "Portraits", ratio: "portrait" },
  { image: img03, alt: "Bride with flowing veil", caption: "Veil in the wind", moment: "Portraits", ratio: "portrait" },
  { image: img04, alt: "Couple lit by golden hour", caption: "Golden hour", moment: "Portraits", ratio: "portrait" },
  { image: img05, alt: "Couple in close embrace", caption: "An exhale", moment: "Portraits", ratio: "portrait" },
  { image: img06, alt: "Couple by a window", caption: "Window light", moment: "Portraits", ratio: "portrait" },
  { image: img07, alt: "Couple walking together", caption: "Walking into the day", moment: "Portraits", ratio: "portrait" },
  { image: img08, alt: "Bride getting ready", caption: "Getting ready", moment: "Portraits", ratio: "portrait" },

  { image: img09, alt: "Ceremony — emotional moment", caption: "The vow", moment: "Ceremony", ratio: "portrait" },
  { image: img10, alt: "Ceremony wide shot", caption: "Witnessed", moment: "Ceremony", ratio: "landscape" },
  { image: img11, alt: "Ceremony portrait", caption: "An honest tear", moment: "Ceremony", ratio: "portrait" },

  { image: img12, alt: "Reception — wide celebration", caption: "Wide-open joy", moment: "Reception", ratio: "landscape" },
  { image: img13, alt: "Reception — candid moment", caption: "Toast", moment: "Reception", ratio: "portrait" },

  { image: img14, alt: "Detail of wedding rings", caption: "Gold and bone", moment: "Details", ratio: "landscape" },
  { image: img15, alt: "Detail vertical", caption: "Stillness", moment: "Details", ratio: "portrait" },

  { image: img16, alt: "Wedding venue landscape", caption: "The setting", moment: "Landscapes", ratio: "landscape" },

  { image: img17, alt: "Aerial vertical view of the venue", caption: "From above", moment: "Aerial", ratio: "portrait" },
  { image: img18, alt: "Aerial landscape view of the location", caption: "Where the day unfolds", moment: "Aerial", ratio: "landscape" },
];
