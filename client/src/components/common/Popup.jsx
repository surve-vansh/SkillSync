import { useEffect, useRef } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import "../common/Popup.css"

const Popup = ({
    open,
    message,
    type = "success",
    onClose,
    onConfirm,
}) => {
    const okRef = useRef(null);
    const handleOk = onConfirm || onClose;

    /* Auto-focus OK button + Enter key support while popup is open */
    useEffect(() => {
        if (!open) return;
        okRef.current?.focus();
        const handler = (e) => {
            if (e.key === "Enter") { e.preventDefault(); handleOk?.(); }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, handleOk]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-[90%] max-w-sm rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl text-center">

                {/* icon */}

                <h3 className="text-xl mb-1 font-bold text-slate-900 dark:text-white">
                    {type === "success" ? "Success" : "Error"}
                </h3>
                {type === "success" ? (
                    <div className="success-animation">
                        <svg
                            className="checkmark"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 52 52"
                        >
                            <circle
                                className="checkmark-circle"
                                cx="26"
                                cy="26"
                                r="25"
                                fill="none"
                            />
                            <path
                                className="checkmark-check"
                                fill="none"
                                d="M14 27l7 7 17-17"
                            />
                        </svg>
                    </div>
                ) : (
                    <div className="text-5xl text-red-500">✕</div>
                )}
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                    {message}
                </p>

                <button
                    ref={okRef}
                    onClick={handleOk}
                    className="mt-5 px-6 py-2 rounded-xl bg-violet-600 text-white"
                >
                    OK
                </button>

            </div>
        </div>
    );
};

export default Popup;

