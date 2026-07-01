import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../Models/user.schema";
import redis from "../utils/redis";
import { sendOtpEmail } from "../utils/sendEmail";
import { CheckOtpRateLimit } from "../utils/checkotpratelimit";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const RateLimit = await CheckOtpRateLimit(email);
    if (RateLimit.blocked) {
      return res.status(429).json({ message: RateLimit.message });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res
        .status(400)
        .json({ message: "Email already registered. Plz login " });
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
    await sendOtpEmail(email, otp);
    return res.status(201).json({ message: "OTP sent to your email" });
  } catch (error) {
    return res.status(500).json({
      message: "Server error Failed to create user",
      error: (error as Error).message,
    });
  }
};

export const ResendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const RateLimit = await CheckOtpRateLimit(email);
    if (RateLimit.blocked) {
      return res.status(429).json({ message: RateLimit.message });
    }
    const existinguser = await User.findOne({ email });
    if (!existinguser) {
      return res
        .status(400)
        .json({ message: "User not found. please sign up first" });
    }
    if (existinguser.isVerified) {
      return res
        .status(400)
        .json({ message: "Email already verified. please login " });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`otp:${email}`, otp, "EX", 600);
    await sendOtpEmail(email, otp);
    return res.status(201).json({ message: "OTP Resent to your email" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to Resend Otp please try again later",
      error: (error as Error).message,
    });
  }
};
export const VerifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = await req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and otp are required" });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User not found.please sign up first" });
    }
    if (existingUser.isVerified) {
      return res
        .status(400)
        .json({ message: "Email already verfified.please login " });
    }
    const StoreOtp = await redis.get(`otp:${email}`);
    if (!StoreOtp) {
      return res
        .status(400)
        .json({ message: "Otp expired please generate new one" });
    }
    if (StoreOtp !== otp) {
      return res
        .status(400)
        .json({ message: "Invalid otp . please enter correct otp" });
    }

    existingUser.isVerified = true;
    await existingUser.save();
    await redis.del(`otp:${email}`);
    await redis.del(`otp_attempts:${email}`);
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      message: "Email Verified Successfully",
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to verify Otp ",
      error: (error as Error).message,
    });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and passwords are required" });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Email or passwords " });
    }
    if (!existingUser.isVerified) {
      return res
        .status(400)
        .json({ message: "please verify your email first " });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "please enter valid password " });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to Login  ",
      error: (error as Error).message,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }
    await redis.set(`blacklist:${token}`, "true", "EX", 60 * 60 * 24 * 7);
    return res.status(200).json({
      message: "Logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to logout",
      error: (error as Error).message,
    });
  }
};
