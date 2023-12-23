"use client";

import Image from "next/image";
import { BlobInfo } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn, fileKeyToUrl } from "@/lib/utils";

export function ShowImageSlug({ blob }: { blob: BlobInfo }) {
  const [show, setShowBlur] = useState(blob.sensitive ?? true);

  const toggleBlur = () => {
    setShowBlur(!show);
  };

  return (
    <>
      <div className="relative rounded-lg overflow-hidden">
        <div>
          <Image
            alt="Image"
            className={cn(
              "duration-700 ease-in-out transform rounded-lg transition will-change-auto group-hover:brightness-110",

              show
                ? "blur-md backdrop-blur-md backdrop-brightness-200"
                : "blur-0 backdrop-blur-0 backdrop-brightness-100"
            )}
            style={{ transform: "translate3d(0, 0, 0)" }}
            src={fileKeyToUrl(blob.rowKey)}
            width={blob.width}
            height={blob.height}
            placeholder="blur"
            blurDataURL={blob.blurhash}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
          />
        </div>

        {show && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Button onClick={toggleBlur} variant={"ghost"}>
              Click to see
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
