"use client";

import React from "react";
import cross from "@/assets/icons/cross.png";
import download from "@/assets/icons/download.png";
import Image from "next/image";
import { BlobInfo } from "@/lib/types";

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

  const handleDownload = async () => {
    const link = document.createElement("a");
    link.download = "downloaded-image";
    link.href = blob.publicUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

              <button
                className="transition-all z-40 absolute text-lg p-2 rounded-full top-3 right-4 text-foreground bg-accent opacity-90 hover:opacity-100"
                onClick={handleDownload}
              >
                <Image src={download} alt="cross" width={22} height={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
