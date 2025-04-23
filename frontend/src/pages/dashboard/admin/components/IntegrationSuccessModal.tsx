import React from "react";

interface Props {
    toolName: string;
    onClose: () => void;
}

const IntegrationSuccessModal: React.FC<Props> = ({ toolName, onClose }) => {
    return (
        <div className="text-center">
            <div className="flex justify-end mb-[24px]">
                <button onClick={onClose}>
                    <img src="/images/close.png" alt="Close" className="w-5 h-5" />
                </button>
            </div>

            <div className="flex justify-center mb-[28px]">
                <img src="/images/check-badge.png" alt="Success" className="w-[60px] h-[60px]" />
            </div>

            <h2 className="text-[16px] font-[400] mb-[4px]">
                {toolName} integration complete!
            </h2>
            <p className="text-[14px] text-[#A5A8B5] mb-[36px]">
                Your bookings will now sync automatically with your <span>
                    {toolName}
                </span>
            </p>

            <button
                className="bg-[#134562] text-white font-[500] text-[14px] w-[140px] py-2 rounded"
                onClick={onClose}
            >
                Done
            </button>
        </div>
    );
};

export default IntegrationSuccessModal;
