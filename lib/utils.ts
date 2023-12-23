import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { config } from "./config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fileKeyToUrl(fileKey: string | undefined) {
  return `${config.cndUrl}qassam/${fileKey}`;
}
