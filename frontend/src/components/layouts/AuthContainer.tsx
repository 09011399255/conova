// components/AuthContainer.tsx
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function AuthContainer({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 200 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className=""
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
