import { GalleryDisplay } from "@/components/gallery";
import { queryLatestImages } from "@/lib/helper/getImages";

export const revalidate = 300;

export default async function Home() {
  const blobs = await queryLatestImages();

  return (
    <main className="mx-auto max-w-[1960px] p-4">
      <GalleryDisplay blobs={blobs} />
    </main>
  );
}
