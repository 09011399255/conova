import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import AuthContainer from "../../components/layouts/AuthContainer";

export default function AccountType() {
    const [selectedType, setSelectedType] = useState<"employee" | "learner" | null>(null);
    const navigate = useNavigate();

    const handleSelect = (type: "employee" | "learner") => {
        setSelectedType(type);
    };

    const handleContinue = () => {
        if (selectedType) {
            navigate("/dashboard");
        }
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
                                className={`flex flex-col items-center justify-center border rounded-xl p-4 w-32 transition ${selectedType === "employee"
                                    ? "bg-[#134562]"
                                    : "bg-white"
                                    }`}
                            >
                                <img
                                    src={
                                        selectedType === "employee"
                                            ? "/images/empactive.png"
                                            : "/images/emp.png"
                                    }
                                    alt="Employee Icon"
                                    className="w-8 h-8 mb-2"
                                />
                                <span className={`text-sm whitespace-nowrap font-medium ${selectedType === "employee"
                                    ? "text-white"
                                    : "text-black"
                                    }`}>I’m an Employee</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSelect("learner")}
                                className={`flex flex-col items-center justify-center border rounded-xl p-4 w-32 transition ${selectedType === "learner"
                                    ? "bg-[#134562]"
                                    : "bg-white"
                                    }`}
                            >
                                <img
                                    src={
                                        selectedType === "learner"
                                            ? "/images/learneractive.png"
                                            : "/images/learner.png"
                                    }
                                    alt="Learner Icon"
                                    className="w-8 h-8 mb-2"
                                />
                                <span className={`text-sm font-medium ${selectedType === "learner"
                                    ? "text-white"
                                    : "text-black"
                                    }`}>I’m a Learner</span>
                            </button>
                        </div>

                        <div className="flex justify-center mt-[40px]">
                            <button
                                disabled={!selectedType}
                                onClick={handleContinue}
                                className={`w-full max-w-xs mb-[120px] bg-[#134562] text-white py-2 rounded-md transition ${!selectedType ? "opacity-50 cursor-not-allowed" : "hover:bg-[#083144]"
                                    }`}
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
