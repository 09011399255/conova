import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../components/layouts/AuthLayout";
import AuthContainer from "../../../components/layouts/AuthContainer";
import { useRef, useState } from "react";

const OTP_LENGTH = 6;
const defaultOtpValues = new Array(OTP_LENGTH).fill("");

export default function ResetOtpVerification() {
  const [otpValues, setOtpValues] = useState(defaultOtpValues);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const newOtp = [...otpValues];
      newOtp[index - 1] = "";
      setOtpValues(newOtp);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmitOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpValues.join("");
    console.log("Submitted OTP:", otp);

    // Add actual verification logic here

    // For now, go to reset-password page
    navigate("/reset-password");
  };

  return (
    <AuthLayout>
      <AuthContainer>
        <div className="bg-[#1345621A] px-[10px] py-[30px] lg:p-[30px] rounded-[20px] relative">
          <img
            src="/images/C.png"
            alt="Login illustration"
            className="absolute top-1/2 w-[70%] opacity-80 left-1/2 transform z-0 -translate-x-1/2 -translate-y-1/2"
          />

          <form
            onSubmit={handleSubmitOtp}
            className="relative w-full max-w-md space-y-6 z-10"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold lg:mt-[50px] text-black">
                Enter OTP
              </h2>
              <p className="text-sm text-[#A5A8B5] mt-1">
                We sent a 6-digit code to{" "}
                <span className="text-black font-semibold">
                  bethanhelen@gmail.com
                </span>
                .
              </p>
              <p className="text-sm text-[#A5A8B5] mt-1">
                Enter it below to continue
              </p>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              {otpValues.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  ref={(el) => {
                    inputsRef.current[idx] = el;
                  }}
                  className="w-12 h-12 text-center text-lg border-2 border-[#134562] rounded-md outline-none  focus:ring-[#134562] "
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-[#134562] text-white py-2 rounded-md hover:bg-[#083144] transition"
            >
              Confirm
            </button>

            <p className="text-sm text-center text-[#A5A8B5]">
              Didn't get any code?{" "}
              <Link to="/register" className="text-[#134562] hover:underline">
                Resend OTP
              </Link>
            </p>

            <p className="text-sm text-center">
              <Link
                to="/login"
                className="text-[#134562] flex items-center justify-center"
              >
                <img
                  src="/images/arrow.png"
                  alt="arrow-left"
                  className="inline-block mr-2"
                />
                Back to Sign in
              </Link>
            </p>
          </form>
        </div>
      </AuthContainer>
    </AuthLayout>
  );
}
