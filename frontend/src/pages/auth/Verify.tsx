import { Link, useNavigate } from "react-router-dom";

import { useRef, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import AuthContainer from "../../components/layouts/AuthContainer";
import Modal from "./components/Modal";

const OTP_LENGTH = 6;
const defaultOtpValues = new Array(OTP_LENGTH).fill("");

export default function Verify() {
    const [otpValues, setOtpValues] = useState(defaultOtpValues);
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const navigate = useNavigate();

    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);



    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otpValues];
        newOtp[index] = value;
        setOtpValues(newOtp);

        if (value && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };


    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
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
        setIsEmailModalOpen(true);
        // Add actual verification logic here

        // For now, go to reset-password page
    };

    const handleEmailModalContinue = () => {
        setIsEmailModalOpen(false);
        setIsLocationModalOpen(true);
    };

    const handleLocationModalContinue = () => {
        setIsLocationModalOpen(false);
        setIsSuccess(true);
    };

    return (
        <AuthLayout>
            <AuthContainer>
                <div className="bg-[#1345621A]   px-[10px] py-[30px] lg:p-[30px] rounded-[20px] relative">
                    <img
                        src="/images/C.png"
                        alt="Login illustration"
                        className="absolute top-1/2 w-[60%] opacity-80 left-1/2 transform z-0 -translate-x-1/2 -translate-y-1/2"
                    />

                    <form
                        onSubmit={handleSubmitOtp}
                        className="relative w-full max-w-md md:w-[400px]  space-y-6 z-10"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold lg:mt-[50px] text-black">
                                Enter OTP
                            </h2>
                            <p className="text-sm text-[#A5A8B5] mt-1">
                                We sent a 6-digit code to{" "}
                                <span className="text-black font-semibold">
                                    bethanhelen@gmail.com
                                </span>.
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
                            <Link to="/register" className="text-[#134562] font-bold hover:underline">
                                Resend OTP
                            </Link>
                        </p>

                    </form>
                </div>
                {isEmailModalOpen && (

                    <Modal onClose={() => setIsEmailModalOpen(false)} showCloseButton={true}>

                        <div className="flex justify-center ">
                            <img
                                src="/images/success.png"
                                alt="Verified"
                                className="w-[100px] h-[100px] mb-[40px] mt-[20px]"
                            />
                        </div>
                        <h2 className="text-xl font-semibold  mb-[40px]">Email Verified Successfully!</h2>
                        <button
                            onClick={handleEmailModalContinue}
                            className="bg-[#134562] w-full mb-[20px] text-white px-6 py-2 rounded-md mt-4 hover:bg-[#0f364b] transition"
                        >
                            Continue
                        </button>
                    </Modal>

                )}

                {isLocationModalOpen && (
                    <Modal onClose={() => setIsLocationModalOpen(false)} closeOnOutsideClick={false}>
                        <h2 className="text-[24px] font-[700] text-left mb-2">Enable Location Services</h2>
                        <p className="text-[#A5A8B5] text-[16px] font-[400] text-left mb-4">
                            Conova needs your location to verify you are physically near an authorized workspace.
                            We never store or share your exact location.
                        </p>

                        <div className="flex justify-center mb-4">
                            <img
                                src="/images/loc2.png"
                                alt="Location"
                                className="w-[30%]"
                            />
                        </div>
                        <button
                            onClick={handleLocationModalContinue}
                            className="bg-[#134562] w-full text-white px-6 py-2 rounded-md mt-4 hover:bg-[#0f364b] transition"
                        >
                            Enable Location Access
                        </button>
                    </Modal>
                )}

                {isSuccess && (
                    <Modal onClose={() => setIsSuccess(false)} closeOnOutsideClick={false}> {/* ✅ FIXED this line */}
                        <h2 className="text-[23px] font-[700] text-center mb-2 ">
                            Welcome to Conova, Oluwatofunmi! 🎉
                        </h2>
                        <p className="text-[#A5A8B5] text-[16px] font-[400] text-center mb-4">
                            Your account has been successfully created.
                            Use your unique QR code to check in at workspaces and verify your presence easily.
                        </p>

                        <div className="flex justify-center mb-4">
                            <img
                                src="/images/qr.png"
                                alt="QR Code"
                                className="w-[35%]"
                            />
                        </div>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="bg-[#134562] w-full text-white px-6 py-2 rounded-md mt-4 hover:bg-[#0f364b] transition"
                        >
                            Go to Dashboard
                        </button>
                    </Modal>
                )}


            </AuthContainer>
        </AuthLayout>
    );
}
