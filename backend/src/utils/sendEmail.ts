import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: `"PadhaiFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your PadhaiFlow verification code",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
          <h2>Verify your email</h2>
          <p>Use the OTP below to verify your PadhaiFlow account. It expires in 10 minutes.</p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; background: #f3f3f3; padding: 12px 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            ${otp}
          </div>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.log("Email failed:", (error as Error).message);
    throw error;
  }
};




  