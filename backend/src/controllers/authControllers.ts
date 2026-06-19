import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../Models/user.schema";
import redis from "../utils/redis";
import { sendOtpEmail } from "../utils/sendEmail";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res
        .status(400)
        .json({ message: "Email already registered. Plz login " });
    }
    const attemptkey = `otp_attempts:${email}`;
    const attempts = await redis.get(attemptkey);
    const attemptCount = attempts ? parseInt(attempts) : 0;
    if (attemptCount >= 3) {
      return res.status(429).json({
        message: "Too many OTP requests. Please try again after 15 minutes.",
      });
    }

    if (existingUser && !existingUser.isVerified) {
      await User.findOneAndDelete({ email });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedpassword,
      isVerified: false,
    });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`otp:${email}`, otp, "EX", 600);
    await redis.incr(attemptkey);
    await redis.expire(attemptkey, 900);
    await sendOtpEmail(email, otp);

   return  res.status(201).json({ message: "OTP sent to your email" });
  } catch (error) {
    return res.status(500).json({
      message: "Server error Failed to create user",
      error: (error as Error).message,
    });
  }
};
