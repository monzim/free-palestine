import { Metadata } from "next";
import { UploadSection } from "./upload";
import { config } from "@/lib/config";
import UploadWarningPopupWrapper from "@/components/popup/first-upload";

export const metadata: Metadata = {
  title: "Upload to Gaza Gallery",
  description: `Help us to share the truth. If you have any photo or video that you think it should be shared with the world, please upload it here. The world needs to know. More than ${config.deadCount.toLocaleString()}  Palestinians have been killed by the terrorist Israeli occupation Army (IDF) in the besieged Gaza Strip since October 7, 2023.`,

  openGraph: {
    images: [
      "https://freepalestine.blob.core.windows.net/qassam/99eaf2d0-8245-11ee-bca2-cd50651227bf",
    ],
  },
};

export default function Page() {
  return (
    <>
      <UploadSection />
      <UploadWarningPopupWrapper />
    </>
  );
}
