import localFont from "next/font/local";

export const fontHilmar = localFont({
  display: "swap",
  src: "../../../../public/fonts/Hilmar-Light.otf",
  variable: "--font-hilmar",
});

export const fontOutfit = localFont({
  display: "swap",
  src: "../../../../public/fonts/Outfit.woff2",
  variable: "--font-outfit",
});
