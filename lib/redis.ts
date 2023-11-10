import { Redis } from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_URL!,
  port: parseInt(process.env.REDIS_PORT!),
  password: process.env.REDIS_SECRET!,
});

export async function getIPHash(ip: string | undefined) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(ip)
  );

  const hash = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hash;
}
