"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UploadImage } from "@/lib/types";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { BadgeX, EyeIcon, EyeOff, Loader2, UploadCloud } from "lucide-react";

function sanitizeForHTTPHeader(value: string): string {
  const sanitizedValue = value.replace(/[^a-zA-Z0-9\-._~ ]/g, " ");
  return sanitizedValue;
}

export function UploadSection() {
  const selectLimit = 24;
  const uploadLimit = 20;
  const textLimit = 300;

  const [blobs, setBlobs] = useState<UploadImage[]>([]);
  const [allSensitive, setAllSensitive] = useState<boolean>(false);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const newBlobs = [...blobs];

    acceptedFiles.forEach((file) => {
      if (!newBlobs.find((blob) => blob.file?.name === file.name)) {
        newBlobs.push({
          file: file,
          fileId: file.name,
          description: "",
          sensitive: false,
        });
      }
    });

    if (newBlobs.length > selectLimit) {
      toast({
        title: "Too many images selected at once.",
        description: `You can only select ${selectLimit} images at a time and you have ${newBlobs.length} selected.`,
        variant: "destructive",
      });
      return;
    }

    setBlobs(newBlobs.slice(0, selectLimit));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (uploading) {
      toast({
        title: "Already Uploading",
        description: "Please wait for the current upload to finish.",
        variant: "destructive",
      });
      return;
    }

    e.preventDefault();
    if (!blobs.length) return;

    if (blobs.length > uploadLimit) {
      toast({
        title: `At most ${uploadLimit} images can be uploaded at once.`,
        description: `You have selected ${blobs.length} images.`,
        action: (
          <ToastAction altText="Try again">
            <button onClick={() => setBlobs(blobs.slice(0, uploadLimit))}>
              Trim to {uploadLimit}
            </button>
          </ToastAction>
        ),

        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      blobs.forEach((blob) => {
        if (!blob.file) return;

        formData.append("images", blob.file);
        formData.append("props", JSON.stringify(blob));
      });

      formData.append(
        "description",
        JSON.stringify({
          description: description,
        })
      );

      console.log("Total Files:", blobs.length);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const error = data.error;
      const quotaLeft = data.quotaLeft;

      if (res.status == 200) {
        toast({
          title: "Images Uploaded",
          description: `You have ${quotaLeft} images left in your quota for today`,
        });

        // clear blobs
        setBlobs([]);
        setDescription("");
        setAllSensitive(false);
        return;
      }

      if (error) {
        toast({
          title: "Failed to Upload Images",
          description: error,
          variant: "destructive",
        });
        return;
      }
    } catch (err: any) {
      toast({
        title: "Failed to Upload Images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newBlobs = [...blobs];
    newBlobs.splice(index, 1);
    setBlobs(newBlobs);
  };

  const toggleSensitive = (index: number) => {
    const newBlobs = [...blobs];
    newBlobs[index].sensitive = !newBlobs[index].sensitive;

    setBlobs(newBlobs);
  };

  const changeAllSensitive = (tog: boolean) => {
    const newBlobs = [...blobs];
    newBlobs.forEach((blob) => (blob.sensitive = tog));

    setBlobs(newBlobs);
    setAllSensitive(tog);
  };

  const convertTOJsonDescriptionJson = (v: string) => {
    return JSON.stringify({
      description: v,
    });
  };

  return (
    <>
      <form onSubmit={onSubmit} className="w-full max-w-3xl mx-auto px-4 py-4">
        <section className="flex flex-col items-center justify-center p-2 mt-10">
          <div className="w-full max-w-md mx-auto">
            <div
              {...getRootProps()}
              className="border-dashed border-2  py-12 flex flex-col items-center justify-center rounded-md cursor-pointer"
            >
              <input {...getInputProps()} />
              <svg
                className=" w-12 h-12 mb-2"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>

              <p className="mb-2">Drag & Drop your images here</p>

              <Button variant="outline" className="px-4 py-2 rounded-lg">
                Or Browse Files
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full max-w-3xl mx-auto px-4 py-4">
          <Textarea
            placeholder="Description (optional)"
            value={description}
            maxLength={textLimit}
            onChange={(e) =>
              setDescription(sanitizeForHTTPHeader(e.target.value))
            }
          />

          <div className="flex items-center space-x-2 mt-6">
            <Switch
              id="mark-sensitive"
              checked={allSensitive}
              onCheckedChange={changeAllSensitive}
            />
            <Label htmlFor="mark-sensitive">Mark all images as sensitive</Label>
          </div>

          <blockquote className="mt-8 border-l-2 pl-6 italic text-destructive-foreground font-bold text-center border-destructive">
            Please mark sensitive images. So that people can choose to view
            them. Sensitive images will be blurred by default and require a
            click to view.
          </blockquote>

          <div className="mt-10 flex justify-center">
            <div>
              <p className="text-sm text-muted-foreground my-2">
                It will take a few minutes to see your images on the website.
              </p>

              <Button
                type="submit"
                disabled={!blobs.length || uploading}
                className="px-4 py-4 w-full max-w-lg rounded-lg"
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="mr-2" />
                )}
                {uploading
                  ? "Uploading..."
                  : `Upload ${blobs.length === 0 ? "" : blobs.length} Image${
                      blobs.length > 1 ? "s" : ""
                    }`}
              </Button>
            </div>
          </div>
        </section>
      </form>

      <div className="mt-8 grid lg:grid-cols-6 md:grid-cols-4 grid-cols-3 gap-4 w-full max-w-4xl mx-auto px-4 md:px-2">
        {blobs.map((blob, index) => (
          <div key={index} className="relative">
            <Dialog>
              <div className={blob.sensitive ? "blur-sm" : ""}>
                <DialogTrigger>
                  <img
                    src={URL.createObjectURL(blob.file!)}
                    alt={`Image ${index}`}
                    className="aspect-square object-cover border w-full rounded-lg overflow-hidden"
                  />
                </DialogTrigger>
              </div>
              <Button
                size={"icon"}
                variant={"secondary"}
                className="absolute top-1 right-1 w-5 h-5 rounded-full"
                onClick={() => removeImage(index)}
              >
                <BadgeX size={16} className="text-destructive-foreground" />
              </Button>

              <Button
                size={"icon"}
                variant={blob.sensitive ? "destructive" : "outline"}
                className="absolute bottom-1 right-1 w-5 h-5"
                onClick={() => toggleSensitive(index)}
              >
                {!blob.sensitive ? (
                  <EyeIcon size={14} className="text-accent-foreground" />
                ) : (
                  <EyeOff size={14} className="text-accent-foreground" />
                )}
              </Button>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Add Individual Description (optional)
                  </DialogTitle>
                  <DialogDescription>{blob.file?.name}</DialogDescription>
                </DialogHeader>
              </DialogContent>

              <DialogContent>
                <ScrollArea className="h-[90vh] w-[450px]">
                  <ul>
                    {blobs.map((blob, index) => (
                      <li
                        key={index}
                        className="flex items-center space-x-2 my-2"
                      >
                        <div className="p-2 mx-auto mr-2">
                          <div className="relative">
                            <div className={blob.sensitive ? "blur-sm" : ""}>
                              <img
                                src={URL.createObjectURL(blob.file!)}
                                alt="Image"
                                className="rounded-md object-scale-down mb-4"
                              />
                            </div>

                            <Button
                              size={"icon"}
                              variant={
                                blob.sensitive ? "destructive" : "outline"
                              }
                              className="absolute bottom-1 right-1 w-7 h-7"
                              onClick={() => toggleSensitive(index)}
                            >
                              {!blob.sensitive ? (
                                <EyeIcon
                                  size={16}
                                  className="text-accent-foreground"
                                />
                              ) : (
                                <EyeOff
                                  size={16}
                                  className="text-accent-foreground"
                                />
                              )}
                            </Button>
                          </div>
                          <Textarea
                            maxLength={textLimit}
                            placeholder="Description (optional)"
                            value={blob.description}
                            onChange={(e) => {
                              const newBlobs = [...blobs];
                              newBlobs[index].description =
                                sanitizeForHTTPHeader(e.target.value);
                              setBlobs(newBlobs);
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>

      <div className="pb-10" />
    </>
  );
}
