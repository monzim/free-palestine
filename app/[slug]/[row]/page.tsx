import { getImageWithPartitionKeyAndRowKey } from "@/lib/helper/getImages";
import { ShowImageSlug } from "./show-image";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { fileKeyToUrl } from "@/lib/utils";

export const revalidate = 1440; // 24 hours

type Props = {
  params: { slug: string; row: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const getData = cache(
  async ({
    params,
  }: {
    params: {
      slug: string;
      row: string;
    };
  }) => {
    return await getImageWithPartitionKeyAndRowKey(params.slug, params.row);
  }
);

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // const blob = await getImageWithPartitionKeyAndRowKey(params.slug, params.row);
  const blob = await getData({
    params: {
      row: params.row,
      slug: params.slug,
    },
  });

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: blob?.description || "Gaza Gallery | Image",
    openGraph: {
      images: [
        fileKeyToUrl(blob?.rowKey) ??
          "https://freepalestine.blob.core.windows.net/qassam/99eaf2d0-8245-11ee-bca2-cd50651227bf",
        ...previousImages,
      ],
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
  const blob = await getData({ params });

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
