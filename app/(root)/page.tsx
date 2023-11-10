import { GalleryDisplay } from "@/components/gallery";
import { getImages } from "@/lib/helper/getImages";

export default async function Home() {
  const blobs = await getImages();

  return (
    <main className="mx-auto max-w-[1960px] p-4">
      <GalleryDisplay blobs={blobs} />
    </main>
  );
}
