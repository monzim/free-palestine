import { config } from "@/lib/config";
import Link from "next/link";

export function ConstructionBanner() {
  return (
    <>
      <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-red-700 px-6 py-2.5 sm:px-3.5 sm:before:flex-1 rounded-md">
        <div className="flex justify-center w-full">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href={config.bannerLink} target="_blank">
              <p className="text-sm leading-6 text-gray-100 text-center">
                <strong className="font-semibold">Do you know?</strong>
                <svg
                  viewBox="0 0 2 2"
                  className="mx-2 inline h-0.5 w-0.5 fill-current"
                  aria-hidden="true"
                >
                  <circle cx={1} cy={1} r={1} />
                </svg>
                {config.bannerMessage}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
