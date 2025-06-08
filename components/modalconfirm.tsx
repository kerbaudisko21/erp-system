"use client";

import React from "react";

interface ModalConfirmProps {
    open: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({open, title = "Konfirmasi", message, onConfirm, onCancel}) => {
    if (!open) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-gray-200 bg-opacity-30 backdrop-blur-sm z-50 flex justify-center items-center">
                <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
                    <h2 className="text-lg font-semibold mb-4">{title}</h2>
                    <p className="mb-6">{message}</p>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                        >
                            Batal
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalConfirm;
