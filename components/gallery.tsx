"use client";


import { BlobInfo } from "@/lib/types";
import GalleryImage from "./gallery-image";
import Link from "next/link";
import { config } from "@/lib/config";
import Image from "next/image";
import palestineFlag from "public/images/1-palestine-flag.jpg";

interface Props {
  blobs: BlobInfo[];
}

export function GalleryDisplay({ blobs }: Props) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
      <div className="after:content relative mb-5 flex h-[629px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <span className="flex max-h-full max-w-full items-center justify-center">
            <Image
              src={palestineFlag}
              alt="Palestine Flag"
              fill
              className="w-full h-full object-cover brightness-100"
            />
          </span>
          <span className="absolute left-0 right-0 bottom-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black"></span>
        </div>

        <h1 className="mt-8 mb-4 font-bold uppercase tracking-widest text-lg">
          Free Palistine
        </h1>
        <div className="justify-center">
          <p className="max-w-[40ch] text-muted-foreground sm:max-w-[32ch] text-center">
            See what is happening in Gaza. The world needs to know. More than{" "}
            <span className="font-bold">
              {config.deadCount.toLocaleString()}
            </span>{" "}
            Palestinians, including{" "}
            <span className="font-bold">
              {config.childrenCount.toLocaleString()}{" "}
            </span>
            have been killed by the Israeli occupation Army (IDF) in the
            besieged Gaza Strip since October 7, 2023.
          </p>
        </div>

        <Link
          href="/upload"
          className="pointer z-10 mt-6 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-4"
        >
          Upload Image
        </Link>
      </div>

      {blobs.map((blob) => (
        <div
          key={blob.id}
          className="after:content group relative mb-5 block w-full cursor-pointer after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
        >
          <GalleryImage blob={blob} />
        </div>
      ))}
    </div>
  );
}
