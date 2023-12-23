"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

const UploadWarningPopupWrapper: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem(
      "gaza-monzim-com-visited-upload"
    );

    if (hasVisitedBefore === null) {
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    see();
  };

  function goBack() {
    router.replace("/");
  }

  const see = () => {
    localStorage.setItem("gaza-monzim-com-visited-upload", "true");
  };

  return (
    <div>
      <AlertDialog defaultOpen={showPopup} open={showPopup}>
        <AlertDialogContent className="text-center">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-primary">
                <InfoIcon className="inline-block w-6 h-6 mr-2" />
                Warning ! Upload
              </h3>
              <blockquote className="mt-6 border-l-2 pl-6 italic text-base">
                &quot;By default, these images will be public. And you can not
                delete them after uploading. Only Palestine related images are
                allowed. You are responsible for any image you upload.&quot;
              </blockquote>
              <p className="text-sm text-muted-foreground  mt-4 my-2 px-4 text-center">
                This site is not responsible for any image. Anyone can upload
                images to this site.
              </p>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription></AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={goBack}
              className={cn(
                buttonVariants({
                  variant: "secondary",
                }),
                "mt-2 sm:mt-0"
              )}
            >
              Go Back
            </AlertDialogAction>
            <AlertDialogAction onClick={handleClose} className="w-full">
              I Understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UploadWarningPopupWrapper;
