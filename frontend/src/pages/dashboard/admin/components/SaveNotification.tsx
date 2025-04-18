import { motion, AnimatePresence } from "framer-motion";

export default function SaveNotification({
    showToast,
    message,
}: {
    showToast: boolean;
    message: string;
}) {
    return (
        <AnimatePresence>
            {showToast && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-[190px] z-[1000] right-[50px] -translate-x-1/2 p-4 rounded-lg bg-[#EDFCF2] border-2 border-[#16B364] text-black text-[16px] font-[500] flex items-center"
                >
                    <img
                        src="/images/suc.png"
                        alt="Success"
                        className="w-5 h-5 mr-2"
                    />
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
