import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import AuthContainer from "../../components/layouts/AuthContainer";

export default function AccountType() {
  const [selectedType, setSelectedType] = useState<"employee">("employee"); 
  const navigate = useNavigate();

  const handleSelect = (type: "employee" | "learner") => {
    if (type === "learner") return; 
    setSelectedType(type);
  };

  const handleContinue = () => {
    navigate("/register", { state: { accountType: selectedType } });
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

          <div className="relative z-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold lg:mt-[50px] text-black mb-[12px]">
                What kind of account would you open?
              </h2>
              <p className="text-sm text-[#A5A8B5]">
                This helps us tailor your workspace experience
              </p>
            </div>

            <div className="flex gap-4 justify-center mt-[40px] mb-9">
              <button
                type="button"
                onClick={() => handleSelect("employee")}
                className={`flex flex-col items-center justify-center bg-[#FFFFFF] border-2 rounded-xl px-4 w-32 transition
                  ${selectedType === "employee" ? "border-[#134562]" : "bg-[#FFFFFF]"}`}
              >
                <img
                  src={
                    selectedType === "employee"
                      ? "/images/br1.png"
                      : "/images/br2.png"
                  }
                  alt="Employee Icon"
                  className="w-8 h-8 mb-[20px] mt-[16px]"
                />
                <span
                  className={`text-sm font-medium whitespace-nowrap ${selectedType === "employee"
                    ? "text-[#134562]"
                    : "text-black"
                    }`}
                >
                  I’m an Employee
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelect("learner")}
                className="flex flex-col items-center justify-center bg-[#F1F1F1] border-2 border-gray-300 rounded-xl p-4 w-32 cursor-not-allowed opacity-50"
                disabled
              >
                <img
                  src="/images/ln1.png"
                  alt="Learner Icon"
                  className="w-8 h-8 mb-[20px] mt-[16px]"
                />
                <span className="text-sm font-medium text-gray-500">
                  I’m a Learner
                </span>
              </button>
            </div>

            <div className="flex justify-center mt-[40px]">
              <button
                onClick={handleContinue}
                className="w-full max-w-xs mb-[120px] bg-[#134562] text-white py-2 rounded-md transition hover:bg-[#083144]"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </AuthContainer>
    </AuthLayout>
  );
}
