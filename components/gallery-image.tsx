"use client";

import { useState } from "react";
import Image from "next/image";
import { BlobInfo } from "@/lib/types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

function GalleryImage({ blob }: { blob: BlobInfo }) {
  const [show, setShowBlur] = useState(blob.sensitive ?? true);
  const [loading, setLoading] = useState(true);

  const toggleBlur = () => {
    setShowBlur(!show);
  };

  return (
    <Dialog>
      <div className="relative rounded-lg overflow-hidden">
        <div>
          <DialogTrigger>
            <Image
              alt="Image"
              className={cn(
                "duration-700 ease-in-out transform rounded-lg transition will-change-auto group-hover:brightness-110",
                // show ? "blur-md backdrop-blur-md backdrop-brightness-200" : ""
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
          </DialogTrigger>
        </div>

        {show && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Button onClick={toggleBlur} variant={"ghost"}>
              Click to see
            </Button>
          </div>
        )}
      </div>

      <DialogContent>
        <div className="relative rounded-lg overflow-hidden">
          <div className="flex justify-center">
            <div className="max-h-[90vh] min-h-[0vh]">
              <ScrollArea className="h-full">
                <Image
                  alt="Image"
                  className={cn(
                    "duration-700 ease-in-out transform rounded-lg transition will-change-auto group-hover:brightness-110",
                    // show ? "blur-md backdrop-blur-md backdrop-brightness-200" : ""
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

                {show && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Button onClick={toggleBlur} variant={"ghost"}>
                      Click to see
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="text-sm font-medium">
                      {blob.description}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <DialogHeader>
          <DialogDescription></DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export default GalleryImage;
