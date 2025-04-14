import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../components/layouts/AuthLayout";
import AuthContainer from "../../../components/layouts/AuthContainer";
import { loginSchema, LoginSchema } from "../../../schemas/loginSchema";

export default function ResetOtpVerification() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });


    const onSubmit = (data: LoginSchema) => {
        console.log(data);
    };

    const navigate = useNavigate();

    return (
        <AuthLayout>
            <AuthContainer >
                <div className="lg:bg-[#1345621A] px-[10px] py-[30px] lg:p-[30px] rounded-[20px] relative">
                    <img
                        src="/images/C.png"
                        alt="Login illustration"
                        className="absolute top-1/2 w-[70%] opacity-40 left-1/2 transform z-0 -translate-x-1/2 -translate-y-1/2"
                    />

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="relative w-[450px] max-w-md space-y-6 z-10"
                    >
                        <div className="text-center ">
                            <h2 className="text-2xl font-bold lg:mt-[50px] text-black">
                                Enter OTP
                            </h2>
                            <p className="text-sm text-[#A5A8B5] mt-1">
                                We sent a 6-digit code to <span className="text-black font-semibold">bethanhelen@gmail.com</span>.
                            </p>
                            <p className="text-sm text-[#A5A8B5] mt-1">
                                Enter it below to continue
                            </p>
                        </div>



                        <div>
                            <label className="block text-sm text-black">
                                Email Address
                            </label>
                            <input
                                type="email"
                                {...register("email")}
                                className={`mt-1 w-full px-4 py-2 border rounded-md bg-transparent outline-none focus:ring-1 ${errors.email
                                    ? "border-[#EF4444] focus:ring-[#EF4444]"
                                    : "border-[#D7D3D0] text-[#292524] focus:ring-[#292524]"
                                    }`}
                                placeholder="Enter email address"
                            />
                            {errors.email && (
                                <p className="text-[#EF4444] text-xs mt-1">{errors.email.message}</p>
                            )}

                        </div>

                        <button
                            onClick={() => navigate("/reset-password")}

                            type="submit"
                            className="w-full bg-[#134562] text-white py-2 rounded-md hover:bg-[#083144] transition"
                        >
                            Confirm
                        </button>

                        <p className="text-sm text-center text-[#A5A8B5]">
                            Didn't get any code?{" "}
                            <Link to="/register" className="text-[#134562]  hover:underline">
                                Resend OTP
                            </Link>
                        </p>

                        <p className="text-sm text-center ">

                            <Link to="/login" className="text-[#134562] flex items-start justify-center">
                                <img src="/images/arrow.png" alt="arrow-left" className="inline-block mr-2" />
                                Back to Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </AuthContainer>
        </AuthLayout>

    );
}
