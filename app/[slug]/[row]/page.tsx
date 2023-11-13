import { getImageWithPartitionKeyAndRowKey } from "@/lib/helper/getImages";
import { ShowImageSlug } from "./show-image";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string; row: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const blob = await getImageWithPartitionKeyAndRowKey(params.slug, params.row);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: blob?.description || "Gaza Gallery | Image",
    openGraph: {
      images: [blob?.publicUrl ?? "", ...previousImages],
    },
  };
}

export default async function Page({
  params,
}: {
  params: {
    slug: string;
    row: string;
  };
}) {
  const blob = await getImageWithPartitionKeyAndRowKey(params.slug, params.row);

  if (!blob) return notFound();

  return (
    <>
      <div className="mx-auto max-w-[1960px] p-4">
        <div className="flex justify-center items-center">
          <ShowImageSlug blob={blob} />
        </div>

        <div className="text-center mt-4">
          <blockquote className="mt-6 border-l-2 pl-6 italic text-lg">
            {blob.description}
          </blockquote>
        </div>
      </div>

      <div className="pb-10" />
    </>
  );
}
