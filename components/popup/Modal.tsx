import React from "react";
import cross from "@/assets/icons/cross.png";
import download from "@/assets/icons/donwload.png";
import linkImg from "@/assets/icons/link.png";
import Image from "next/image";
import Link from "next/link";

interface CustomModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  href: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  modal,
  setModal,
  children,
  href,
}) => {
  if (!modal) return null;

  const handleDownload = async () => {
    const link = document.createElement("a");
    link.download = "downloaded-image";
    link.href = href;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed w-screen h-screen inset-0 z-50 bg-accent flex items-center justify-center overflow-x-hidden overflow-y-auto">
      <div className="relative w-screen h-screen flex items-center justify-center">
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
          <Link
            href={href}
            rel="noopener noreferrer"
            target="_blank"
            className="transition-all z-40 absolute text-lg p-2 rounded-full top-3 right-20 text-foreground bg-accent opacity-90 hover:opacity-100"
          >
            <Image src={linkImg} alt="cross" width={22} height={22} />
          </Link>
        </div>
        <div className="inset-0 min-w-full min-h-full relative">{children}</div>
      </div>
    </div>
  );
};

export default CustomModal;
