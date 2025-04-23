import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import AuthContainer from "../../components/layouts/AuthContainer";
import { registerSchema, RegisterSchema } from "../../schemas/registerSchema";
import { useWatch } from "react-hook-form";
import { PasswordRules } from "./components/PasswordRules";
import { useMutation } from "@tanstack/react-query";
import { registerUser, RegistrationResponse } from "../../api";
import { ClientError } from "../../api/apiFetchWrapper";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const passwordValue = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useMutation({
    mutationFn: (data: RegisterSchema) => {
      const { phoneNumber, terms, ...stuffApiNeeds } = data;
      const payload = {
        full_name: stuffApiNeeds.fullName,
        email: stuffApiNeeds.email,
        password: stuffApiNeeds.password,
        re_password: stuffApiNeeds.confirmPassword,
        role: stuffApiNeeds.role,
      };

      return registerUser(payload);
    },
    onSuccess: (data: RegistrationResponse) => {
      const url = `/verify?email=${encodeURIComponent(data.user.email)}`;

      navigate(url, { replace: true });
    },
    onError: (error: ClientError) => {
      if (error.status === 0) {
        toast.error("Please ensure you have an internet connection");
      }
      //case 1 User already has account registered
      else if (error.data.email) {
        toast.error("This account already exists, Kindly proceed to login");
      }

      //Any other error is probably validation related and should not even be happending, cos we are alredy valiating on the frontend
    },
  });

  const onSubmit = (data: RegisterSchema) => {
    registerMutation.mutate(data);
  };

  // const [selectedRole, setSelectedRole] = useState<string>(getValues("role"));

  // const handleRoleChange = (val: string) => {
  //   const role = val as "user" | "admin";
  //   setSelectedRole(role);
  //   setValue("role", role);
  // };
  return (
    <AuthLayout>
      <AuthContainer>
        <div className="lg:bg-[#1345621A] px-[10px] py-[30px] lg:p-[30px] rounded-[20px] relative">
          <img
            src="/images/C.png"
            alt="Login illustration"
            className="absolute top-1/2 opacity-80 left-1/2 transform z-0 -translate-x-1/2 -translate-y-1/2"
          />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative w-full max-w-md z-10 "
          >
            <div className="text-center ">
              <h2 className="text-2xl font-bold lg:mt-[50px] text-black mb-[12px]">
                Let’s Get You Started!
              </h2>
              <p className="text-sm text-[#A5A8B5] mb-[40px]">
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

            <div className="mb-[16px]">
              <label className="block text-sm text-black">
                Full Name <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                {...register("fullName")}
                className={`mt-1 w-full px-4 py-2 border rounded-md bg-transparent outline-none focus:ring-1 ${
                  errors.fullName
                    ? "border-[#EF4444] focus:ring-[#EF4444]"
                    : "border-[#D7D3D0] text-[#292524] focus:ring-[#292524]"
                }`}
                placeholder="e.g., Oluwatofunmi Ishola"
              />
              {errors.fullName && (
                <p className="text-[#EF4444] text-xs mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div className="mb-[16px]">
              <label className="block text-sm text-black">
                Phone Number <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="tel"
                {...register("phoneNumber")}
                className={`mt-1 w-full px-4 py-2 border rounded-md bg-transparent outline-none focus:ring-1 ${
                  errors.phoneNumber
                    ? "border-[#EF4444] focus:ring-[#EF4444]"
                    : "border-[#D7D3D0] text-[#292524] focus:ring-[#292524]"
                }`}
                placeholder="Enter phone number"
              />
              {errors.phoneNumber && (
                <p className="text-xs text-[#EF4444] mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="mb-[16px]">
              <label className="block text-sm text-black">
                Work Email Address <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                className={`mt-1 w-full px-4 py-2 border rounded-md bg-transparent outline-none focus:ring-1 ${
                  errors.email
                    ? "border-[#EF4444] focus:ring-[#EF4444]"
                    : "border-[#D7D3D0] text-[#292524] focus:ring-[#292524]"
                }`}
                placeholder="e.g., tofunmi.ishola@company.com"
              />
              {errors.email && (
                <p className="text-xs text-[#EF4444] mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* <CustomRoleDropdown
              value={selectedRole}
              onChange={handleRoleChange}
              error={errors.role?.message}
            /> */}

            <div className="mb-[16px]">
              <label className="block text-sm text-black">
                Role <span className="text-[#EF4444]">*</span>
              </label>
              <select
                {...register("role")}
                className={`mt-1 w-full px-4 py-2 border rounded-md bg-transparent outline-none focus:ring-1 appearance-none ${
                  errors.role
                    ? "border-[#EF4444] focus:ring-[#EF4444]"
                    : "border-[#D7D3D0] text-[#292524] focus:ring-[#292524]"
                }`}
              >
                <option value="" disabled>
                  Select a role
                </option>
                {["employee", "manager", "learner", "admin"].map(
                  (option, i) => (
                    <option key={i} className="capitalize">
                      {option}
                    </option>
                  )
                )}
              </select>
              {errors.role && (
                <p className="text-xs text-[#EF4444] mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="my-[20px]">
              <label className="block text-sm  text-black">
                Create a Password <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`mt-1 w-full px-4 py-2 border rounded-md bg-transparent outline-none focus:ring-1 ${
                    errors.password
                      ? "border-[#EF4444] focus:ring-[#EF4444]"
                      : "border-[#D7D3D0] text-[#292524] focus:ring-[#292524]"
                  }`}
                  placeholder="Create a password"
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

            <div className="mb-[16px]">
              <label className="block text-sm  text-black">
                Confirm password <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className={`mt-1 w-full px-4 py-2 border rounded-md bg-transparent outline-none focus:ring-1 ${
                    errors.confirmPassword
                      ? "border-[#EF4444] focus:ring-[#EF4444]"
                      : "border-[#D7D3D0] text-[#292524] focus:ring-[#292524]"
                  }`}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-4 text-[#134562]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[#EF4444] text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="mb-[18px]">
              <div className="flex items-start mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  {...register("terms")}
                  className="mt-[2px] accent-[#134562] w-4 h-4 rounded border border-gray-300"
                />
                <label
                  htmlFor="terms"
                  className="ml-3 block text-sm text-gray-700 hover:text-underline"
                >
                  I agree to the
                  <span className="text-[#134562] font-medium cursor-pointer ml-1 hover:underline">
                    Terms and Conditions
                  </span>
                </label>
              </div>
              {errors.terms && (
                <p className="text-xs block text-[#EF4444] mt-1">
                  {errors.terms.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className={`w-full mb-[20px] py-2 rounded-md transition text-white
    ${
      registerMutation.isPending
        ? "bg-[#0f3a52] cursor-not-allowed animate-pulse"
        : "bg-[#134562] hover:bg-[#083144] cursor-pointer"
    }
  `}
            >
              {registerMutation.isPending ? "Registering..." : "Register"}
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
