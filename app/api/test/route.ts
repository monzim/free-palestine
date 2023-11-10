import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let ip;
  var headers = req.headers;

  if (headers.get("x-forwarded-for")) {
    ip = headers.get("x-forwarded-for")?.split(",")[0];
  } else if (headers.get("x-real-ip")) {
    ip = req.headers.get("x-real-ip");
  } else {
    ip = req.geo?.country;
  }

  return NextResponse.json({
    ip: ip,
    data: JSON.stringify(req.geo),
    request: req,
    headers: req.headers,
  });
}
