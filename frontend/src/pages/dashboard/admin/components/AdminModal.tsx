// components/Modal.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

export default function AdminModal({
    show,
    onClose,
    children,
}: {
    show: boolean;
    onClose: () => void;
    children: ReactNode;
}) {
    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed top-0 left-0 inset-0 justify-center bg-black/30 backdrop-blur-sm z-[1000]"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal content */}
                    <motion.div
                        className="absolute z-[1000] bg-white rounded-xl shadow-lg w-full max-w-md p-6
             top-[20%] left-0 -translate-x-1/2 -translate-y-1/2
             md:top-[30px] md:right-[30px] md:left-auto md:translate-x-0 md:translate-y-0"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        {children}
                    </motion.div>

                </>
            )}
        </AnimatePresence>
    );
}
