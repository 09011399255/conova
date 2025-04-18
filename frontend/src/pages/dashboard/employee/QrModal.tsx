// QRModalContent.tsx
const QRModalContent = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="text-center px-3 py-2">
            <div className="flex justify-end items-start">

                <button type="button" onClick={onClose} className="text-gray-500 mb-[13px] hover:text-gray-700">
                    <img src="/images/close.png" alt="Close" className="w-5 h-5" />
                </button>
            </div>
            <p className="text-[#A5A8B5] text-[16px] font-[400] mb-[26px]">
                Here is your unique QR code to check in at workspaces and verify your presence easily.
            </p>
            <img
                src="/images/qr.png"
                alt="QR Code"
                className="mx-auto w-[160px] h-[160px]"
            />
        </div>
    );
};

export default QRModalContent;
