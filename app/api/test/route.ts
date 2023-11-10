import { getIPHash, redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const globalCountKey = "global_upload_count";

  const uploadLimit = 10; // per hour
  const newUploadCount = 1; // Set the variable to the desired increment value

  try {
    const ip = req.ip;
    const userHash = await getIPHash(ip);

    const userCount = await redis.incrby(userHash, newUploadCount);
    const globalCount = await redis.incrby(globalCountKey, newUploadCount);

    if (userCount > uploadLimit) {
      return new NextResponse("User uploaded max", { status: 202 });
    }

    return NextResponse.json({
      message: "success",
      quotaLeft: Math.max(0, userCount - uploadLimit),
      globalUploadCount: globalCount,
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
