import { Redis } from "@upstash/redis";

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 60;

export async function rateLimit(identifier: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return { allowed: true, remaining: MAX_REQUESTS, enabled: false };
  }

  const redis = new Redis({ url, token });
  const bucket = Math.floor(Date.now() / (WINDOW_SECONDS * 1000));
  const key = `ratelimit:${identifier}:${bucket}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, WINDOW_SECONDS);

  return {
    allowed: count <= MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - count),
    enabled: true,
  };
}
