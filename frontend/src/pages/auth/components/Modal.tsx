import { useEffect, useRef, ReactNode } from "react";

interface ModalProps {
    onClose: () => void;
    children: ReactNode;
    showCloseButton?: boolean;
    closeOnOutsideClick?: boolean; // ✅ Optional prop
}

export default function Modal({
    onClose,
    children,
    showCloseButton = false,
    closeOnOutsideClick = true, // ✅ Default to true
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                closeOnOutsideClick &&
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose, closeOnOutsideClick]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div
                ref={modalRef}
                className="bg-white p-8 rounded-2xl shadow-lg w-[400px] md:w-[500px] text-center relative"
            >
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute text-[30px] text-[#000000] top-4 right-4 hover:text-gray-600"
                    >
                        &times;
                    </button>
                )}
                {children}
            </div>
        </div>
    );
}
