"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
    id: number;
    name: string;
    stock: number;
}

interface StockMutation {
    id: number;
    productId: number;
    productName: string;
    type: "in" | "out";
    quantity: number;
    date: string;
    note: string;
}

const dummyProducts: Product[] = [
    { id: 1, name: "Oli Yamalube", stock: 20 },
    { id: 2, name: "Ban IRC", stock: 5 },
    { id: 3, name: "Aki GS", stock: 0 },
];

export default function StockMutationPage() {
    const [products, setProducts] = useState(dummyProducts);
    const [mutations, setMutations] = useState<StockMutation[]>([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | "">("");
    const [type, setType] = useState<"in" | "out">("in");
    const [quantity, setQuantity] = useState("");
    const [note, setNote] = useState("");

    const resetForm = () => {
        setSelectedProductId("");
        setType("in");
        setQuantity("");
        setNote("");
    };

    const handleAddMutation = () => {
        if (!selectedProductId) {
            toast.error("Pilih produk terlebih dahulu");
            return;
        }
        if (!quantity || Number(quantity) <= 0) {
            toast.error("Masukkan jumlah yang valid");
            return;
        }
        const product = products.find((p) => p.id === selectedProductId);
        if (!product) {
            toast.error("Produk tidak ditemukan");
            return;
        }
        const qty = Number(quantity);

        // cek stok kalau mutasi keluar
        if (type === "out" && product.stock < qty) {
            toast.error("Stok tidak cukup untuk pengurangan");
            return;
        }

        // update stok produk
        const updatedProducts = products.map((p) => {
            if (p.id === selectedProductId) {
                return {
                    ...p,
                    stock: type === "in" ? p.stock + qty : p.stock - qty,
                };
            }
            return p;
        });

        // tambah mutasi
        const newMutation: StockMutation = {
            id: mutations.length + 1,
            productId: selectedProductId,
            productName: product.name,
            type,
            quantity: qty,
            date: new Date().toLocaleString(),
            note,
        };

        setProducts(updatedProducts);
        setMutations([newMutation, ...mutations]);
        toast.success("Mutasi stok berhasil ditambahkan");
        resetForm();
        setModalOpen(false);
    };

    return (
        <div className="w-full min-h-screen p-6">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar theme="light" />

            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Stock Mutation</h1>
                <Button onClick={() => setModalOpen(true)}>Tambah Mutasi Stok</Button>
            </header>

            {/* Table Mutasi */}
            <section className="overflow-x-auto rounded border shadow-sm px-2 mb-6">
                <table className="min-w-full bg-white text-sm text-left">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-5 py-3 border-b font-medium text-gray-700">Tanggal</th>
                        <th className="px-5 py-3 border-b font-medium text-gray-700">Produk</th>
                        <th className="px-5 py-3 border-b font-medium text-gray-700">Tipe</th>
                        <th className="px-5 py-3 border-b font-medium text-gray-700 text-right">Jumlah</th>
                        <th className="px-5 py-3 border-b font-medium text-gray-700">Keterangan</th>
                    </tr>
                    </thead>
                    <tbody>
                    {mutations.length > 0 ? (
                        mutations.map((m) => (
                            <tr key={m.id} className="border-t hover:bg-gray-50 transition">
                                <td className="px-5 py-3">{m.date}</td>
                                <td className="px-5 py-3">{m.productName}</td>
                                <td
                                    className={`px-5 py-3 font-semibold ${
                                        m.type === "in" ? "text-green-600" : "text-red-600"
                                    }`}
                                >
                                    {m.type === "in" ? "Masuk" : "Keluar"}
                                </td>
                                <td className="px-5 py-3 text-right">{m.quantity}</td>
                                <td className="px-5 py-3">{m.note}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center py-6 text-gray-500 italic">
                                Belum ada mutasi stok
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>

            {/* Modal Add Mutation */}
            {modalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                        <h2 className="text-lg font-semibold mb-4">Tambah Mutasi Stok</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 font-medium" htmlFor="product">
                                    Produk
                                </label>
                                <select
                                    id="product"
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={selectedProductId}
                                    onChange={(e) => setSelectedProductId(Number(e.target.value))}
                                    autoFocus
                                >
                                    <option value="">Pilih produk</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} (Stok: {p.stock})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 font-medium" htmlFor="type">
                                    Tipe Mutasi
                                </label>
                                <select
                                    id="type"
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={type}
                                    onChange={(e) => setType(e.target.value as "in" | "out")}
                                >
                                    <option value="in">Masuk</option>
                                    <option value="out">Keluar</option>
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 font-medium" htmlFor="quantity">
                                    Jumlah
                                </label>
                                <input
                                    id="quantity"
                                    type="number"
                                    min={1}
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="Masukkan jumlah"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium" htmlFor="note">
                                    Keterangan
                                </label>
                                <input
                                    id="note"
                                    type="text"
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    resetForm();
                                    setModalOpen(false);
                                }}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleAddMutation}
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                Tambah
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
