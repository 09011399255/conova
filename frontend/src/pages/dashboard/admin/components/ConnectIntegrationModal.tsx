// components/ConnectIntegrationModal.tsx
import React from "react";

interface Props {
    toolName: string;
    onClose: () => void;
    onConnectSuccess: () => void;
}

const ConnectIntegrationModal: React.FC<Props> = ({ toolName, onClose, onConnectSuccess }) => {
    return (
        <div className="text-center">
            <div className="flex justify-end items-start mb-[24px]">

                <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <img src="/images/close.png" alt="Close" className="w-5 h-5" />
                </button>
            </div>
            <h2 className="text-[16px] font-[400] mb-[4px]">
                Connect {toolName} to Conova?
            </h2>
            <p className="text-[14px] max-w-[400px] text-center mx-auto font-[400] text-[#A5A8B5] mb-[36px]">
                Authorize access to sync your events and meeting room bookings with {toolName}.
                This helps you manage your schedule more efficiently.
            </p>

            <div className=" flex justify-center gap-4">
                <button
                  onClick={onConnectSuccess}
                    className="bg-[#134562] font-[500] text-[14px] text-white w-[140px] py-2 rounded"
                >
                    Connect
                </button>
                <button
                    className="border border-[#134562] font-[500] text-[14px] text-[#134562] w-[140px] py-2 rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ConnectIntegrationModal;
