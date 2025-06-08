import {ReactNode} from "react";
import {motion, AnimatePresence} from "framer-motion";

interface SideSheetProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    width?: string; // default w-[400px]
}

export function SideSheet({open, onClose, children, width = "w-[400px]"}: SideSheetProps) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Overlay gelap dengan blur dan fade */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        onClick={onClose}
                    />

                    {/* Panel side sheet */}
                    <motion.div
                        className={`fixed right-0 top-0 h-full bg-white shadow-2xl z-50 ${width} flex flex-col`}
                        initial={{x: "100%"}}
                        animate={{x: 0}}
                        exit={{x: "100%"}}
                        transition={{type: "tween", duration: 0.3}}
                    >
                        {/* Header sticky */}
                        <header
                            className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
                            <h2 className="text-xl font-semibold text-gray-800">Detail Purchase Order</h2>
                            <button
                                aria-label="Close"
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition text-2xl font-bold"
                            >
                                &times;
                            </button>
                        </header>

                        {/* Konten utama scrollable */}
                        <div className="p-6 overflow-y-auto flex-1 text-gray-700 text-sm">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
