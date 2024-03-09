import { GalleryDisplay } from "@/components/gallery";
import { queryLatestImageV2 } from "@/lib/helper/get-images";

export default async function Home() {
  const blobs = await queryLatestImageV2();

  return (
    <main className="mx-auto max-w-[1960px] p-4">
      <GalleryDisplay blobs={blobs} />
    </main>
  );
}
function queryLatestImagesV2() {
  throw new Error("Function not implemented.");
}
