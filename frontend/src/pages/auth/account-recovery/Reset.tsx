import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../../components/layouts/AuthLayout";
import AuthContainer from "../../../components/layouts/AuthContainer";
import { resetSchema, ResetSchema } from "../../../schemas/resetSchema";
import { useMutation } from "@tanstack/react-query";
import {
  requestPasswordReset,
  RequestPasswordResetPayload,
} from "../../../api";
import { ClientError } from "../../../api/apiFetchWrapper";
import { toast } from "react-toastify";

export default function Reset() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetSchema>({
    resolver: zodResolver(resetSchema),
  });

  const navigate = useNavigate();

  const handleRequestPasswordResetMutation = useMutation({
    mutationFn: (data: RequestPasswordResetPayload) => {
      return requestPasswordReset(data);
    },
    onSuccess: (_, variables) => {
      const url = `/reset-otp-verification?email=${encodeURIComponent(
        variables.email
      )}`;

      navigate(url, { replace: true });
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

  const onSubmit = (data: ResetSchema) => {
    handleRequestPasswordResetMutation.mutate(data);
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
            onSubmit={handleSubmit(onSubmit)}
            className="relative w-full max-w-md space-y-6 z-10"
          >
            <div className="text-center ">
              <h2 className="text-2xl font-bold lg:mt-[50px] text-black mb-[12px]">
                Reset Password
              </h2>
              <p className="text-sm text-[#A5A8B5] mt-1">
                We’ll send you reset instructions. Enter your Conova registered
                email address
              </p>
            </div>

            <div>
              <label className="block text-sm text-black">Email Address</label>
              <input
                type="email"
                {...register("email")}
                className={`mt-1 w-full px-4 py-2 border rounded-md bg-transparent outline-none focus:ring-1 ${
                  errors.email
                    ? "border-[#EF4444] focus:ring-[#EF4444]"
                    : "border-[#D7D3D0] text-[#292524] focus:ring-[#292524]"
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-[#EF4444] text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={handleRequestPasswordResetMutation.isPending}
              className={`w-full mb-[20px] py-2 rounded-md transition text-white
    ${
      handleRequestPasswordResetMutation.isPending
        ? "bg-[#0f3a52] cursor-not-allowed animate-pulse"
        : "bg-[#134562] hover:bg-[#083144] cursor-pointer"
    }
  `}
            >
              {handleRequestPasswordResetMutation.isPending
                ? "Sending Instructions..."
                : "Send Instructions"}
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
      </AuthContainer>
    </AuthLayout>
  );
}
