import { NextRequest } from "next/server";

export function getIP(req: NextRequest) {
  let ip;
  var headers = req.headers;

  if (headers.get("x-forwarded-for")) {
    ip = headers.get("x-forwarded-for")?.split(",")[0];
  } else if (headers.get("x-real-ip")) {
    ip = req.headers.get("x-real-ip");
  } else {
    ip = req.ip;
  }

  return ip;
}
