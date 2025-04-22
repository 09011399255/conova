import { useNavigate, useSearchParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import AuthContainer from "../../components/layouts/AuthContainer";
import Modal from "./components/Modal";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import {
  activateUser,
  ActivateUserPayload,
  resendOtp,
  ResendOtpPayload,
} from "../../api";
import { ClientError } from "../../api/apiFetchWrapper";

const OTP_LENGTH = 6;
const defaultOtpValues = new Array(OTP_LENGTH).fill("");
const RESEND_TIMEOUT = 60; // 60 seconds countdown

export default function Verify() {
  const [otpValues, setOtpValues] = useState(defaultOtpValues);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const [countdown, setCountdown] = useState(0);

  const userEmail = searchParams.get("email");
  if (!userEmail) {
    toast.error("Something went wrong");
    return;
  }

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const activateUserMutation = useMutation({
    mutationFn: (data: ActivateUserPayload) => {
      return activateUser(data);
    },
    onSuccess: () => {
      setIsEmailModalOpen(true);
    },
    onError: (error: ClientError) => {
      if (error.status === 0) {
        toast.error(
          "Connection lost while trying to activate Your account, please contact support"
        );
      }
      //any other error wey fi sup nha invalid otp
      if (error.status === 400) {
        toast.error("Invalid OTP");
      }
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: (data: ResendOtpPayload) => {
      console.log(data);
      return resendOtp(data);
    },
    onSuccess: () => {
      toast.success("OTP has been resent to your email");
      setCountdown(RESEND_TIMEOUT);
    },
    onError: (error: ClientError) => {
      //Any error at this point would either be faulty email or something network
      if (error.status === 0) {
        toast.error("Please ensure you have an internet connection");
      } else {
        toast.error("Failed to resend OTP");
      }
    },
  });

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

    const data = {
      email: userEmail,
      otp: otpValues.join(""),
    };

    activateUserMutation.mutate(data);
  };

  const handleResendOtp = () => {
    // Create proper payload object for resend
    const resendPayload: ResendOtpPayload = {
      email: userEmail,
    };

    resendOtpMutation.mutate(resendPayload);
  };

  const handleEmailModalContinue = () => {
    setIsEmailModalOpen(false);
    setIsLocationModalOpen(true);
  };

  const handleLocationModalContinue = () => {
    setIsLocationModalOpen(false);
    toast.info(
      "Location verified! Please sign in to complete your account setup and access your dashboard."
    );

    const url = `/login?newUser=${encodeURIComponent(true)}`;

    navigate(url, { replace: true });

    // setIsSuccess(true);
  };
  return (
    <AuthLayout>
      <AuthContainer>
        <div className="bg-[#1345621A] px-[10px] py-[30px] lg:p-[30px] rounded-[20px] relative">
          <img
            src="/images/C.png"
            alt="Login illustration"
            className="absolute top-1/2 w-[60%] opacity-80 left-1/2 transform z-0 -translate-x-1/2 -translate-y-1/2"
          />

          <form
            onSubmit={handleSubmitOtp}
            className="relative w-full max-w-md md:w-[400px] space-y-6 z-10"
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
                  className="w-12 h-12 text-center text-lg border-2 border-[#134562] rounded-md outline-none focus:ring-[#134562]"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={activateUserMutation.isPending}
              className={`w-full py-2 rounded-md transition text-white 
                ${
                  activateUserMutation.isPending
                    ? "bg-[#0f3a52] cursor-not-allowed animate-pulse"
                    : "bg-[#134562] hover:bg-[#083144] cursor-pointer"
                }
              `}
            >
              {activateUserMutation.isPending ? "Confirming..." : "Confirm"}
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
                  disabled={resendOtpMutation.isPending || countdown > 0}
                  className={`text-[#134562] font-bold hover:underline ${
                    resendOtpMutation.isPending
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {resendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Modals remain unchanged */}
        {isEmailModalOpen && (
          <Modal
            onClose={() => setIsEmailModalOpen(false)}
            showCloseButton={true}
          >
            <div className="flex justify-center ">
              <img
                src="/images/success.png"
                alt="Verified"
                className="w-[100px] h-[100px] mb-[40px] mt-[20px]"
              />
            </div>
            <h2 className="text-xl font-semibold mb-[40px]">
              Email Verified Successfully!
            </h2>
            <button
              onClick={handleEmailModalContinue}
              className="bg-[#134562] w-full mb-[20px] text-white px-6 py-2 rounded-md mt-4 hover:bg-[#0f364b] transition"
            >
              Continue
            </button>
          </Modal>
        )}

        {isLocationModalOpen && (
          <Modal
            onClose={() => setIsLocationModalOpen(false)}
            closeOnOutsideClick={false}
          >
            <h2 className="text-[24px] font-[700] text-left mb-2">
              Enable Location Services
            </h2>
            <p className="text-[#A5A8B5] text-[16px] font-[400] text-left mb-4">
              Conova needs your location to verify you are physically near an
              authorized workspace. We never store or share your exact location.
            </p>

            <div className="flex justify-center mb-4">
              <img src="/images/loc2.png" alt="Location" className="w-[30%]" />
            </div>
            <button
              onClick={handleLocationModalContinue}
              className="bg-[#134562] w-full text-white px-6 py-2 rounded-md mt-4 hover:bg-[#0f364b] transition"
            >
              Enable Location Access
            </button>
          </Modal>
        )}
      </AuthContainer>
    </AuthLayout>
  );
}
