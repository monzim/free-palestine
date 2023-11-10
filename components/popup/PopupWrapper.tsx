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

const PopupWrapper: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");

    if (hasVisitedBefore === null) {
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    see();
  };

  const see = () => {
    localStorage.setItem("hasVisitedBefore", "true");
  };

  return (
    <div>
      <AlertDialog defaultOpen={showPopup} open={showPopup}>
        <AlertDialogContent className="text-center">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-orange-600">
                <InfoIcon className="inline-block w-6 h-6 mr-2" />
                Warning !
              </h3>
              <blockquote className="mt-6 border-l-2 pl-6 italic text-base">
                &quot;This site contains graphic images of dead bodies and
                injured people. By default, these images are blurred. And anyone
                who is under 18 years old should not see these images.&quot;
              </blockquote>
              <p className="text-sm text-muted-foreground  mt-4 my-2 px-4 text-center">
                Anyone can upload images to this site. We are not responsible
                for any image.
              </p>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription></AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleClose} className="w-full">
              I accept
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PopupWrapper;
