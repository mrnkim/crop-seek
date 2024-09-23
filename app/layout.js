import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

export const metadata = {
  title: "Crop and Seek",
  description:
    "Search videos using either an image or text query. Easily crop images before searching for more precise results.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
