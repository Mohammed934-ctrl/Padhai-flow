import { useState, useEffect, useRef } from "react";
import { axiosInstance } from "@/utils/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { maskEmail } from "@/utils/maskemail";
import { useAuth } from "@/context/AuthContext";
const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

const { login } = useAuth();

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  // focus first box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handlchange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newotp = [...otp];
    newotp[index] = digit;
    setOtp(newotp);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;
    const newotp = Array(6).fill("");
    pasted.split("").forEach((char, i) => {
      newotp[i] = char;
    });
    setOtp(newotp);
    const lastindex = Math.min(pasted.length, 5);
    inputRefs.current[lastindex]?.focus();
  };
  const handleVerify = async () => {
    const otpvalue = otp.join("");
    if (otpvalue.length < 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    setIsVerifying(true);
    try {
      const res = await axiosInstance.post("/auth/verify-otp", { email, otp: otpvalue });
      toast.success("Email verified! Welcome to PadhaiFlow 🎉");
      login(res.data.token,res.data.user)
      navigate("/dashboard");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Invalid OTP. Try again.";
      toast.error(message);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await axiosInstance.post("/auth/resend-otp", { email });
      setResendMessage("");
      toast.success("New OTP sent to your email!");
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to resend OTP.";
      toast.error(message);
      if (error?.response?.status === 429) {
        setResendDisabled(true);
        setResendMessage(message);
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div
          className="w-150 h-150 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
          }}
        />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-card border border-border/60  rounded-2xl  p-7 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              Verify your email
            </h1>
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit code to{" "}
              <span className="text-foreground font-medium">{maskEmail(email)}</span>
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                onChange={(e) => handlchange(index, e.target.value)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={digit}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                type="text"
                inputMode="numeric"
                className="w-12 h-12 text-center text-lg font-semibold rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            ))}
          </div>
          <Button
            className="w-full h-10"
            onClick={handleVerify}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying…
              </>
            ) : (
              "Verify email"
            )}
          </Button>
          <div className="text-sm text-muted-foreground text-center mt-4">
            Didn't receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={isResending || resendDisabled}
              className="text-primary font-medium hover:underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
            >
              {isResending
                ? "Sending…"
                : resendDisabled
                  ? "Limit reached"
                  : "Resend OTP"}
            </button>
          </div>

          {resendMessage && (
            <p className="text-xs text-destructive text-center mt-2">
              {resendMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
