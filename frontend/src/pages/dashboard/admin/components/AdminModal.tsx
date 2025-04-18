import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';

export default function AdminModal({
    show,
    onClose,
    children,
    maxWidth = "max-w-[500px]"
}: {
    show: boolean;
    onClose: () => void;
    children: ReactNode;
    maxWidth?: string;
}) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [show]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-[1000] modal flex items-center justify-center"
                        onClick={handleBackdropClick}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Modal Content */}
                        <motion.div
                            ref={modalRef}
                            className={`bg-white rounded-xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto custom-scrollbar p-6`} initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        >
                            {children}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
