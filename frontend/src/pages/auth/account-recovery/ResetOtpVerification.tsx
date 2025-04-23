import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../../components/layouts/AuthLayout";
import AuthContainer from "../../../components/layouts/AuthContainer";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import {
  requestPasswordReset,
  RequestPasswordResetPayload,
  verifyOtp,
  VerifyPayload,
  VerifyPayloadResponse,
} from "../../../api";
import { ClientError } from "../../../api/apiFetchWrapper";

const OTP_LENGTH = 6;
const defaultOtpValues = new Array(OTP_LENGTH).fill("");

export default function ResetOtpVerification() {
  const [otpValues, setOtpValues] = useState(defaultOtpValues);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const RESEND_TIMEOUT = 60;
  const userEmail = searchParams.get("email");
  if (!userEmail) {
    toast.error("Something went wrong");
    return;
  }
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
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

  const handleResendOtpMutation = useMutation({
    mutationFn: (data: RequestPasswordResetPayload) => {
      return requestPasswordReset(data);
    },
    onSuccess: () => {
      setCountdown(RESEND_TIMEOUT);
    },
    onError: (error: ClientError) => {
      //Any other thing here on God!

      if (error.status === 0) {
        toast.error(
          "Please ensure you have an internet connection and try again"
        );
      }
    },
  });

  const handleVerifyOtpValidation = useMutation({
    mutationFn: (data: VerifyPayload) => {
      return verifyOtp(data);
    },
    onSuccess: (data: VerifyPayloadResponse, variables: VerifyPayload) => {
      const token = data.token;

      const url = `/reset-password?resetToken=${encodeURIComponent(
        token
      )}&email=${encodeURIComponent(variables.email)}`;

      navigate(url, { replace: true });
    },
    onError: (error: ClientError) => {
      console.error(error, error.message, error.status);
      if (error.status === 0) {
        toast.error("Please ensure you have an internet connection");
      }
      //case 2, OTP don go
      else if (error.status == 400) {
        toast.error("Invalid or expired OTP");
      }
    },
  });
  const handleSubmitOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpValues.join("");

    const data = {
      email: userEmail,
      otp: otp,
    };
    handleVerifyOtpValidation.mutate(data);
  };

  const handleResendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      email: userEmail,
    };
    handleResendOtpMutation.mutate(data);
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
                <span className="text-black font-semibold">{userEmail}</span>.
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
              disabled={handleVerifyOtpValidation.isPending}
              className={`w-full mb-[20px] py-2 rounded-md transition text-white
    ${
      handleVerifyOtpValidation.isPending
        ? "bg-[#0f3a52] cursor-not-allowed animate-pulse"
        : "bg-[#134562] hover:bg-[#083144] cursor-pointer"
    }
  `}
            >
              {handleVerifyOtpValidation.isPending
                ? "Confirming..."
                : "Confirm"}
            </button>

            <div className="text-sm text-center text-[#A5A8B5]">
              Didn't get any code?{" "}
              {countdown > 0 ? (
                <span className="text-[#134562] font-bold">
                  Resend in {countdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={handleResendOtpMutation.isPending || countdown > 0}
                  className={`text-[#134562] font-bold hover:underline ${
                    handleResendOtpMutation.isPending
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {handleResendOtpMutation.isPending
                    ? "Sending..."
                    : "Resend OTP"}
                </button>
              )}
            </div>

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
