const QRModalContent = ({
    onClose,
    qrCodeUrl,
    isLoading,
    isError,
}: {
    onClose: () => void;
    qrCodeUrl?: string;
    isLoading: boolean;
    isError: boolean;
}) => {
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

            {isLoading && <p className="text-sm text-gray-400">Loading QR Code...</p>}
            {isError && <p className="text-sm text-red-500">Failed to load QR Code.</p>}

            {!isLoading && !isError && qrCodeUrl && (
                <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="mx-auto w-[160px] h-[160px]"
                />
            )}
        </div>
    );
};

export default QRModalContent;
