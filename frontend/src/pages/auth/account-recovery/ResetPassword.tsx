import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../../components/layouts/AuthLayout";
import AuthContainer from "../../../components/layouts/AuthContainer";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from "../../../schemas/resetPasswordSchema";
import { PasswordRules } from "../components/PasswordRules";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { submitPasswordReset } from "../../../api";
import { ClientError } from "../../../api/apiFetchWrapper";

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

  const passwordValue = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();

  const userEmail = searchParams.get("email");
  const resetToken = searchParams.get("resetToken");
  if (!userEmail && !resetToken) {
    toast.error("Something went wrong");
    return;
  }

  const submitResetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordSchema) => {
      const payload = {
        email: userEmail!,
        token: resetToken!,
        new_password: data.password,
        re_new_password: data.confirmPassword,
      };

      return submitPasswordReset(payload);
    },

    onSuccess: () => {
      //Just navigate and shikena
      setIsModalOpen(true);
      const url = `/login?email=${encodeURIComponent(userEmail!)}`;

      navigate(url, { replace: true });
    },
    onError: (error: ClientError) => {
      if (error.status === 0) {
        toast.error("Please ensure you have an internet connection");
      }
      //case 2, any other other wey wan sup
      else if (error.status == 400) {
        toast.error("Invalid or expired OTP");
      }
    },
  });

  const onSubmit = (data: ResetPasswordSchema) => {
    if (!userEmail || !resetToken) {
      toast.error("an error occured");
      return;
    }
    submitResetPasswordMutation.mutate(data);
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
            onSubmit={handleSubmit(onSubmit)}
            className="relative w-full max-w-md space-y-6 z-10"
          >
            <div className="text-center ">
              <h2 className="text-2xl font-bold lg:mt-[50px] text-black mb-[12px]">
                Create New Password
              </h2>
              <p className="text-sm text-[#A5A8B5] mt-1">
                Your password must be different from the previously used
                password
              </p>
            </div>

            <div>
              <label className="block text-sm  text-black">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`mt-1 w-full px-4 py-2 border rounded-md bg-transparent outline-none focus:ring-1 ${
                    errors.password
                      ? "border-[#EF4444] focus:ring-[#EF4444]"
                      : "border-[#D7D3D0] text-[#292524] focus:ring-[#292524]"
                  }`}
                  placeholder="Enter your new password"
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
                <p className="text-[#EF4444] text-xs mt-1">
                  {errors.password.message}
                </p>
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
                  className={`mt-1 w-full px-4 py-2 border rounded-md bg-transparent outline-none focus:ring-1 ${
                    errors.confirmPassword
                      ? "border-[#EF4444] focus:ring-[#EF4444]"
                      : "border-[#D7D3D0] text-[#292524] focus:ring-[#292524]"
                  }`}
                  placeholder="Enter your new password"
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
                <p className="text-[#EF4444] text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitResetPasswordMutation.isPending}
              className={`w-full mb-[20px] py-2 rounded-md transition text-white
    ${
      submitResetPasswordMutation.isPending
        ? "bg-[#0f3a52] cursor-not-allowed animate-pulse"
        : "bg-[#134562] hover:bg-[#083144] cursor-pointer"
    }
  `}
            >
              {submitResetPasswordMutation.isPending
                ? "Confirming..."
                : "Confirm"}
            </button>

            <p className="text-sm text-center ">
              <Link
                to="/login"
                className="text-[#134562] flex items-start justify-center"
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

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)} showCloseButton={true}>
            <div className="flex justify-center">
              <img
                src="/images/success.png"
                alt="Verified"
                className="w-[100px] mb-[40px] mt-[20px] h-[100px]"
              />
            </div>
            <h2 className="text-xl font-semibold mb-[40px]">
              Password Reset Successfully
            </h2>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#134562] text-white w-full px-6 py-2 rounded-md mb-[20px] hover:bg-[#0f364b] transition"
            >
              Log In
            </button>
          </Modal>
        )}
      </AuthContainer>
    </AuthLayout>
  );
}
