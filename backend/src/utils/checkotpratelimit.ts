import redis from "./redis";
interface RateLimitResult {
  blocked: boolean;
  message?: string;
}
export async function CheckOtpRateLimit(
  email: string,
): Promise<RateLimitResult> {
  const attemptkey = `otp_attempts:${email}`;
  const attempycounts = await redis.incr(attemptkey);
  if (attempycounts === 1) {
    await redis.expire(attemptkey, 900);
  }
  if (attempycounts > 4) {
    const ttl = await redis.ttl(attemptkey);
    if (ttl > 0) {
      const minutes = Math.ceil(ttl / 60);

      return {
        blocked: true,
        message: `Too many Otp requests .please try again  in ${minutes} minute(s)`,
      };
    }
  }

  return {
    blocked: false,
  };
}
