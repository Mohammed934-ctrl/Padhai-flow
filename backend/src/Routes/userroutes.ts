import { Router } from "express";
import { register, ResendOtp, VerifyOtp ,Login, logout} from "../controllers/authControllers"
import { authmiddleware} from "../Middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/resend-otp",ResendOtp)
router.post("/verify-otp",VerifyOtp)
router.post("/login",Login)
router.post("/logout",authmiddleware,logout)

export default router;