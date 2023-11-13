"use client";

import React from "react";
import cross from "@/assets/icons/cross.png";
import linkIcon from "@/assets/icons/link.png";

import Image from "next/image";
import { BlobInfo } from "@/lib/types";
import Link from "next/link";
import { Share2Icon } from "lucide-react";
import { toast } from "../ui/use-toast";

interface CustomModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  blob: BlobInfo;
}

const CustomModal: React.FC<CustomModalProps> = ({
  modal,
  setModal,
  children,
  blob,
}) => {
  if (!modal) return null;

  const handleCopyLink = async () => {
    const fullUrl =
      window.location.origin + "/" + blob.partitionKey + "/" + blob.rowKey;
    await navigator.clipboard.writeText(fullUrl);
    toast({
      description: "Link copied to clipboard",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto backdrop-blur-lg bg-accent/10">
      <div>
        <div className="relative flex items-center justify-center bg-transparent">
          <div className="inset-0 h-[90vh] relative">
            {children}
            <div>
              <button
                className="transition-all z-40 absolute text-lg p-2 rounded-full top-3 left-4 text-foreground bg-accent opacity-90 hover:opacity-100"
                onClick={() => setModal(false)}
              >
                <Image src={cross} alt="cross" width={22} height={22} />
              </button>

              <Link
                href={blob.partitionKey + "/" + blob.rowKey}
                className="transition-all z-40 absolute text-lg p-2 rounded-full top-3 right-20 text-foreground bg-accent opacity-90 hover:opacity-100"
              >
                <Image src={linkIcon} alt="cross" width={22} height={22} />
              </Link>

              <button
                className="transition-all z-40 absolute text-lg p-2 rounded-full top-3 right-4 text-foreground bg-accent opacity-90 hover:opacity-100"
                onClick={handleCopyLink}
              >
                <Share2Icon size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
