"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import axios from "axios";
import { useEffect, useState } from "react";

export function QuotaSection() {
  const [loading, setLoading] = useState(true);
  const [quotaLeft, setQuotaLeft] = useState(null);

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const response = await axios.get("/api/upload");
        console.log(
          "🚀 ~ file: upload.tsx:345 ~ fetchQuota ~ response:",
          response
        );
        setQuotaLeft(response.data.quotaLeft);
      } catch (error) {
        console.error("Error fetching quota:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuota();
  }, []);

  return (
    <>
      <Alert className="w-auto">
        <AlertTitle>
          {loading
            ? "..."
            : quotaLeft === 0
            ? "Quota exceeded"
            : `${quotaLeft} quota left for today`}
        </AlertTitle>
      </Alert>
      <QuotaSection />
    </>
  );
}
