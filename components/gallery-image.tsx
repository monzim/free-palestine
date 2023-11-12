"use client";

import { useState } from "react";
import Image from "next/image";
import { BlobInfo } from "@/lib/types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import CustomModal from "@/components/popup/Modal";

function GalleryImage({ blob }: { blob: BlobInfo }) {
  const [show, setShowBlur] = useState(blob.sensitive ?? true);
  const [modal, setModal] = useState(false);

  const toggleBlur = () => {
    setShowBlur(!show);
  };

  return (
    <>
      <div className="relative rounded-lg overflow-hidden">
        <div>
          <Image
            onClick={() => setModal(true)}
            alt="Image"
            className={cn(
              "duration-700 ease-in-out transform rounded-lg transition will-change-auto group-hover:brightness-110",

              show
                ? "blur-md backdrop-blur-md backdrop-brightness-200"
                : "blur-0 backdrop-blur-0 backdrop-brightness-100"
            )}
            style={{ transform: "translate3d(0, 0, 0)" }}
            src={blob.publicUrl}
            width={720}
            height={480}
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

      <CustomModal modal={modal} setModal={setModal} blob={blob}>
        <Image
          src={blob.publicUrl}
          alt="Image"
          placeholder="blur"
          blurDataURL={blob.blurhash}
          width={blob.width}
          height={blob.height}
          className={cn(
            `w-auto h-full hover:cursor-default object-contain rounded-md shadow-md overflow-hidden`,
            show
              ? "blur-md backdrop-blur-md backdrop-brightness-200"
              : "blur-0 backdrop-blur-0 backdrop-brightness-100"
          )}
        />
        {show && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Button onClick={toggleBlur} variant={"ghost"}>
              Click to see
            </Button>
          </div>
        )}
      </CustomModal>
    </>
  );
}
export default GalleryImage;
