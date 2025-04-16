import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../components/layouts/AuthLayout";
import AuthContainer from "../../../components/layouts/AuthContainer";
import { loginSchema, LoginSchema } from "../../../schemas/loginSchema";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { resetPasswordSchema, ResetPasswordSchema } from "../../../schemas/resetPasswordSchema";
import { PasswordRules } from "../components/PasswordRules";
import Modal from "../components/Modal";

export default function ResetPassword() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const [isModalOpen, setIsModalOpen] = useState(false);


    const passwordValue = useWatch({ control, name: "password", defaultValue: "" });


    const onSubmit = (data: ResetPasswordSchema) => {
        console.log(data);
        setIsModalOpen(true);

    };

    const [showPassword, setShowPassword] = useState(false);



    return (
        <AuthLayout>
            <AuthContainer >
                <div className="lg:bg-[#1345621A] px-[10px] py-[30px] lg:p-[30px] rounded-[20px] relative">
                    <img
                        src="/images/C.png"
                        alt="Login illustration"
                        className="absolute top-1/2 w-[70%] opacity-80 left-1/2 transform z-0 -translate-x-1/2 -translate-y-1/2"
                    />

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="relative w-full max-w-md space-y-6 z-10"
                    >
                        <div className="text-center ">
                            <h2 className="text-2xl font-bold lg:mt-[50px] text-black mb-[12px]">
                                Create New Password
                            </h2>
                            <p className="text-sm text-[#A5A8B5] mt-1">
                                Your password must be different from the previously used password
                            </p>
                        </div>


                        <div>
                            <label className="block text-sm  text-black">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    className={`mt-1 w-full px-4 py-2 border rounded-md bg-transparent outline-none focus:ring-1 ${errors.password
                                        ? "border-[#EF4444] focus:ring-[#EF4444]"
                                        : "border-[#D7D3D0] text-[#292524] focus:ring-[#292524]"
                                        }`} placeholder="Enter your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-4 text-[#134562]"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-[#EF4444] text-xs mt-1">{errors.password.message}</p>
                            )}

                            <PasswordRules password={passwordValue} />

                        </div>



                        <div>
                            <label className="block text-sm  text-black">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("confirmPassword")}
                                    className={`mt-1 w-full px-4 py-2 border rounded-md bg-transparent outline-none focus:ring-1 ${errors.confirmPassword
                                        ? "border-[#EF4444] focus:ring-[#EF4444]"
                                        : "border-[#D7D3D0] text-[#292524] focus:ring-[#292524]"
                                        }`} placeholder="Enter your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-4 text-[#134562]"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-[#EF4444] text-xs mt-1">{errors.confirmPassword.message}</p>
                            )}

                        </div>



                        <button
                            type="submit"
                            className="w-full bg-[#134562] text-white py-2 rounded-md hover:bg-[#083144] transition"
                        >
                            Confirm
                        </button>

                        <p className="text-sm text-center ">

                            <Link to="/login" className="text-[#134562] flex items-start justify-center">
                                <img src="/images/arrow.png" alt="arrow-left" className="inline-block mr-2" />
                                Back to Sign in
                            </Link>
                        </p>
                    </form>
                </div>

                {isModalOpen && (
                    <Modal
                        onClose={() => setIsModalOpen(false)}
                        title="Password Reset Successfully"
                        message="Your password has been reset successfully. You can now log in with your new password."
                        buttonText="Log In"
                        redirectTo="/login"
                    />
                )}

            </AuthContainer>
        </AuthLayout>

    );
}
