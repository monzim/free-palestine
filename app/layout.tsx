import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";

import { ConstructionBanner } from "@/components/banner";
import { config } from "@/lib/config";
import { URL } from "url";

const handjet = Josefin_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gaza Gallery | Free Palestine",
  description: `See what is happening in Gaza. The world needs to know. More than ${config.deadCount.toLocaleString()} Palestinians have been killed by the terrorist Israeli occupation Army (IDF) in the besieged Gaza Strip since October 7, 2023.`,
  category: "Gallery",
  metadataBase: new URL("https://gaza.monzim.com"),
  openGraph: {
    title: "Gaza Gallery | Free Palestine",
    description: `See what is happening in Gaza. The world needs to know. More than ${config.deadCount.toLocaleString()} Palestinians have been killed by the terrorist Israeli occupation Army (IDF) in the besieged Gaza Strip since October 7, 2023.`,
    images: [
      "https://freepalestine.blob.core.windows.net/qassam/99eaf2d0-8245-11ee-bca2-cd50651227bf",
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@monzim",
    title: "Gaza Gallery | Free Palestine",
    description: `See what is happening in Gaza. The world needs to know. More than ${config.deadCount.toLocaleString()} Palestinians have been killed by the terrorist Israeli occupation Army (IDF) in the besieged Gaza Strip since October 7, 2023.`,
    images: [
      "https://freepalestine.blob.core.windows.net/qassam/99eaf2d0-8245-11ee-bca2-cd50651227bf",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={handjet.className}>
        <div className="mx-6 mt-2 ">
          <ConstructionBanner />
        </div>

        {children}
        <Toaster />
      </body>
    </html>
  );
}
