import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, LoginSchema } from "../../schemas/loginSchema";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthContainer from "../../components/layouts/AuthContainer";
import { useMutation } from "@tanstack/react-query";
import { ClientError } from "../../api/apiFetchWrapper";
import { LoginResponse, loginUser } from "../../api"; // Import the actual login function
import { toast } from "react-toastify";
import Modal from "./components/Modal";
import { initAuth } from "../../api/authFetch";

export default function Login() {
  const [searchParams, setSearchParams] = useSearchParams();
  const emailFromParams = searchParams.get("email");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: emailFromParams || "",
    },
  });

  // Set email from URL params, including this cos I am coming from the angle of a first time user account from our register flow and also our reset Pasword flow
  useEffect(() => {
    if (emailFromParams) {
      setValue("email", emailFromParams);
    }
  }, [emailFromParams, setValue]);

  const emailValue = watch("email");
  const passwordValue = watch("password");

  // const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showNewUserWelcome, setShowNewUserWelcome] = useState<boolean>(false);
  const navigate = useNavigate();
  const loginMutation = useMutation({
    mutationFn: (data: LoginSchema) => {
      return loginUser(data);
    },
    onSuccess: (data: LoginResponse) => {
      //Calling this to let's get the auth party started
      initAuth();
      //This also returns the role fam and we could use that to navigate to the dashboard depending, I'll meet with sultan to discuss that
      if (searchParams.has("email")) {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("email");
        setSearchParams(newParams);
      }

      toast.info(
        `Login successful, now we gotta use RBAC and protect our routes too fam, but right now you role is ${data.role}`
      );
      if (
        searchParams.has("newUser") &&
        Boolean(searchParams.get("newUser")) == true
      ) {
        setShowNewUserWelcome(true);
        toast.info(
          "We ought to delete this qr code, but I am leaving it for senior dev sultan for now"
        );
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("newUser");
        setSearchParams(newParams);
      } else {
        //Now data returns the role and it's at this point I know where to navigate to fam, using rbac and we also gotta protect our routes
        toast.info("This is coming soon");
        navigate("/dashboard");
      }
    },
    onError: (error: ClientError) => {
      if (error.status === 0) {
        toast.error("Please ensure you have an internet connection");
      }
      if (error.status === 401) {
        if (error.data.detail) {
          toast.error("Incorrect email or password");
        } else {
          toast.error(
            "Your account is not yet activated, please contact support."
          );
        }
      }
    },
  });

  const onSubmit = (data: LoginSchema) => {
    loginMutation.mutate(data);
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
              disabled={loginMutation.isPending}
              className={`w-full bg-[#134562] text-white py-2 rounded-md ${
                loginMutation.isPending
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-[#083144]"
              } transition`}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-sm text-center text-[#A5A8B5] mt-[20px]">
              Don't have an account yet?{" "}
              <Link to="/" className="text-[#134562]  hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>
        {showNewUserWelcome && (
          <Modal
            onClose={() => setShowNewUserWelcome(false)}
            closeOnOutsideClick={false}
          >
            <h2 className="text-[23px] font-[700] text-center mb-2 ">
              Welcome to Conova, NameThatShouldComeFromBackend 🎉
            </h2>
            <p className="text-[#A5A8B5] text-[16px] font-[400] text-center mb-4">
              Your account has been successfully created. Use your unique QR
              code to check in at workspaces and verify your presence easily.
            </p>
            <div className="flex justify-center mb-4">
              <img src="/images/qr.png" alt="QR Code" className="w-[35%]" />
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
