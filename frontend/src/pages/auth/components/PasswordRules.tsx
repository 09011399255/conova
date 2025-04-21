import { CheckCircle, Circle } from "lucide-react";

export const PasswordRules = ({ password }: { password: string }) => {
    const rules = [
        {
            label: "8 characters",
            valid: password.length >= 8,
        },
        {
            label: "Lower case",
            valid: /[a-z]/.test(password),
        },
        {
            label: "Upper case",
            valid: /[A-Z]/.test(password),
        },
        {
            label: "One special character",
            valid: /[^A-Za-z0-9]/.test(password),
        },
        {
            label: "Digit",
            valid: /\d/.test(password),
        },
    ];

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {rules.map((rule) => (
                <div
                    key={rule.label}
                    className={`flex items-center px-2 py-1 rounded-full text-sm border ${rule.valid
                        ? "text-green-600 border-green-600 bg-green-100"
                        : "text-gray-400 border-gray-300"
                        }`}
                >
                    {rule.valid ? (
                        <CheckCircle size={16} className="mr-1" />
                    ) : (
                        <Circle size={16} className="mr-1" />
                    )}
                    {rule.label}
                </div>
            ))}
        </div>
    );
};

