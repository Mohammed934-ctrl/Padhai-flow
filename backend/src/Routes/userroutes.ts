import { Router } from "express";
import { register, ResendOtp, VerifyOtp ,Login} from "../controllers/authControllers"

const router = Router();

router.post("/register", register);
router.post("/resend-otp",ResendOtp)
router.post("/verify-otp",VerifyOtp)
router.post("/login",Login)

export default router;