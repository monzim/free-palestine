import { Metadata } from "next";
import { UploadSection } from "./upload";

export const metadata: Metadata = {
  title: "Upload to Gaza Gallery",
  description:
    "Help us to share the truth. If you have any photo or video that you think it should be shared with the world, please upload it here. The world needs to know. More than 10,000 Palestinians have been killed by the terrorist Israeli occupation Army (IDF) in the besieged Gaza Strip since October 7, 2023.",
};

export default function Page() {
  return (
    <>
      <UploadSection />
    </>
  );
}
