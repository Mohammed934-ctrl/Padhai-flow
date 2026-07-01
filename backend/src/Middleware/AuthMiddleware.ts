import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import redis from "../utils/redis";
import User from "../Models/user.schema";
import { IUser } from "../Models/user.schema";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authmiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Token is required",
      });
    }
    const decodedtoken = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as {
      id: string;
    };
    const blacklist = await redis.get(`blacklist:${token}`);
    if (blacklist) {
      return res.status(401).json({
        message: "Token invalid. Please login again.",
      });
    }
    const user = await User.findById(decodedtoken.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
   req.user = user;
   return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
