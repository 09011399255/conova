import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, LoginSchema } from "../../schemas/loginSchema";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import AuthContainer from "../../components/layouts/AuthContainer";

export default function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: LoginSchema) => {
    console.log(data);
    navigate("/dashboard");
  };

  return (
    <AuthLayout>
      <AuthContainer>
        <div className="bg-[#1345621A] px-[10px] py-[30px] lg:p-[30px] rounded-[20px] relative">
          <img
            src="/images/C.png"
            alt="Login illustration"
            className="absolute top-1/2 opacity-50 left-1/2 transform z-0 -translate-x-1/2 -translate-y-1/2"
          />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative w-full max-w-md z-10"
          >
            <div className="text-center ">
              <h2 className="text-2xl font-bold lg:mt-[50px] text-black mb-[12px]">
                Welcome back to Conova!
              </h2>
              <p className="text-sm text-[#A5A8B5] mt-1 mb-[40px]">
                Book shared workspaces with ease. Collaborate, grow, and
                innovate.
              </p>
            </div>

            <div className="sm:flex gap-3 block space-y-3 sm:space-y-0 mb-[20px]">
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

            <div className="text-center text-gray-400 text-sm flex justify-center items-center mb-[20px]">
              <span className="inline-block w-2/3 border-b border-[#DCDFE3]"></span>
              <span className="mx-2">OR</span>
              <span className="inline-block w-2/3 border-b border-[#DCDFE3]"></span>
            </div>

            <div className="">
              <label className="block text-sm text-black">Email Address</label>
              <input
                type="email"
                {...register("email")}
                className={`mt-[8px] w-full px-4 py-2 border rounded-md bg-transparent outline-none transition-all
                                    ${
                                      errors.email
                                        ? "border-[#EF4444] focus:ring-[#EF4444]"
                                        : emailValue
                                        ? "border-2 border-[#292524]" // <-- persist focus look when there's a value
                                        : "border-[#D7D3D0] focus:border-[#292524]"
                                    }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-[#EF4444] text-xs mt-[8px]">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="my-[16px]">
              <label className="block text-sm  text-black">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`mt-[8px] w-full px-4 py-2 border rounded-md bg-transparent outline-none transition-all
                                        ${
                                          errors.password
                                            ? "border-[#EF4444] focus:ring-[#EF4444]"
                                            : passwordValue
                                            ? "border-2 border-[#292524]" // <-- persist focus look when there's a value
                                            : "border-[#D7D3D0] focus:border-[#292524]"
                                        }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-5 text-[#134562]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[#EF4444] text-xs mt-[8px]">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="text-right text-sm mt-[12px] mb-[20px]">
              <Link to="/reset" className="text-[#134562] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#134562] text-white py-2 rounded-md hover:bg-[#083144] transition"
            >
              Sign in
            </button>

            <p className="text-sm text-center text-[#A5A8B5] mt-[20px]">
              Don’t have an account yet?{" "}
              <Link to="/" className="text-[#134562]  hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </AuthContainer>
    </AuthLayout>
  );
}
