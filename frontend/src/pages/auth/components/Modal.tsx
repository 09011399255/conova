import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface ModalProps {
    onClose: () => void;
    title?: string;
    message: string;
    buttonText?: string;
    imageSrc?: string;
    redirectTo?: string;
}

export default function Modal({
    onClose,
    title = "Success",
    message,
    buttonText = "Continue",
    redirectTo,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const handleButtonClick = () => {
        onClose();
        if (redirectTo) {
            navigate(redirectTo);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div
                ref={modalRef}
                className="bg-white p-8 rounded-2xl shadow-lg w-[400px] md:w-[500px] text-center relative"
            >
                <button
                    onClick={onClose}
                    className="absolute text-[30px] text-[#000000] top-4 right-4 hover:text-gray-600"
                >
                    &times;
                </button>


                <div className="flex justify-center mb-4">
                    <div className=" p-4 rounded-full">
                        <img
                            src="/images/success.png"
                            alt="Verified"
                            className="w-[100px] h-[100px]"
                        />

                    </div>
                </div>

                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                {/* <p className="text-gray-700 mb-4">{message}</p> */}
                <button
                    onClick={handleButtonClick}
                    className="bg-[#134562] text-white px-6 py-2 rounded-md mt-4 hover:bg-[#0f364b] transition"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}
