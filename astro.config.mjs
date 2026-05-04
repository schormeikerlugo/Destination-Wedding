import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

export default defineConfig({
  site: "https://kathrinledwon.com",
  integrations: [sitemap(), icon({ iconDir: "src/icons" })],
  image: {
    responsiveStyles: true,
  },
});
