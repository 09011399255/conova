import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, LoginSchema } from "../../schemas/loginSchema";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link } from "react-router-dom";
import AuthContainer from "../../components/layouts/AuthContainer";

export default function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = (data: LoginSchema) => {
        console.log(data);
    };

    return (
        <AuthLayout>
            <AuthContainer >
                <div className="lg:bg-[#1345621A] px-[10px] py-[30px] lg:p-[30px] rounded-[20px] relative">
                    <img
                        src="/images/C.png"
                        alt="Login illustration"
                        className="absolute top-1/2 opacity-40 left-1/2 transform z-0 -translate-x-1/2 -translate-y-1/2"
                    />

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="relative w-full max-w-md space-y-6 z-10"
                    >
                        <div className="text-center ">
                            <h2 className="text-2xl font-bold lg:mt-[50px] text-black">
                                Create an account on Conova!
                            </h2>
                            <p className="text-sm text-[#A5A8B5] mt-1">
                                Book shared workspaces with ease. Collaborate, grow, and innovate.
                            </p>
                        </div>

                        <div className="sm:flex gap-3 block space-y-3 sm:space-y-0">
                            <button
                                type="button"
                                className="w-full flex items-center  text-black  justify-center gap-2 border border-[#A5A8B5] px-4 py-2 rounded-md hover:bg-gray-100"
                            >
                                <FcGoogle className="text-xl" />
                                Sign in with Google
                            </button>
                            <button
                                type="button"
                                className="w-full flex items-center text-black justify-center gap-2 border border-[#A5A8B5] px-4 py-2 rounded-md hover:bg-gray-100"
                            >
                                <FaApple className="text-xl" />
                                Sign in with Apple
                            </button>
                        </div>

                        <div className="text-center text-gray-400 text-sm flex justify-center items-center">
                            <span className="inline-block w-2/3 border-b border-[#DCDFE3]"></span>
                            <span className="mx-2">OR</span>
                            <span className="inline-block w-2/3 border-b border-[#DCDFE3]"></span>
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
                            type="submit"
                            className="w-full bg-[#134562] text-white py-2 rounded-md hover:bg-[#083144] transition"
                        >
                            Sign in
                        </button>
                        <p className="text-sm text-center text-[#A5A8B5]">
                            Already have an account?{" "}
                            <Link to="/login" className="text-[#134562] hover:underline">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </AuthContainer>
        </AuthLayout>

    );
}
