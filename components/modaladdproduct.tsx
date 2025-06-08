"use client";
import {useState} from "react";

interface ProductForm {
    name: string;
    category: string;
    stock: string;
}

interface Product {
    id: number;
    name: string;
    category: string;
    stock: number;
}

interface ModalAddProductProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (newProduct: Omit<Product, "id">) => void;
}

export default function ModalAddProduct({open, onClose, onSubmit}: ModalAddProductProps) {
    const [form, setForm] = useState<ProductForm>({name: "", category: "", stock: ""});
    const [errors, setErrors] = useState<{ name?: string; category?: string; stock?: string }>({});

    if (!open) return null;

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!form.name.trim()) newErrors.name = "Nama produk wajib diisi";
        if (!form.category) newErrors.category = "Kategori wajib dipilih";
        if (form.stock === "") newErrors.stock = "Stok wajib diisi";
        else if (isNaN(Number(form.stock)) || Number(form.stock) < 0)
            newErrors.stock = "Stok harus berupa angka 0 atau lebih";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit({name: form.name.trim(), category: form.category, stock: Number(form.stock)});
            setForm({name: "", category: "", stock: ""});
            setErrors({});
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center pointer-events-auto">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-60">
                <h2 className="text-lg font-semibold mb-4">Tambah Produk Baru</h2>
                {/* Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium" htmlFor="name">
                            Nama Produk
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className={`w-full border rounded px-3 py-2 text-sm ${errors.name ? "border-red-500" : "border-gray-300"}`}
                            value={form.name}
                            onChange={handleChange}
                            autoFocus
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium" htmlFor="category">
                            Kategori
                        </label>
                        <select
                            id="category"
                            name="category"
                            className={`w-full border rounded px-3 py-2 text-sm ${errors.category ? "border-red-500" : "border-gray-300"}`}
                            value={form.category}
                            onChange={handleChange}
                        >
                            <option value="">Pilih kategori</option>
                            <option value="oli">Oli</option>
                            <option value="ban">Ban</option>
                            <option value="aki">Aki</option>
                            <option value="sparepart">Sparepart</option>
                        </select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium" htmlFor="stock">
                            Stok
                        </label>
                        <input
                            id="stock"
                            name="stock"
                            type="number"
                            min={0}
                            className={`w-full border rounded px-3 py-2 text-sm ${errors.stock ? "border-red-500" : "border-gray-300"}`}
                            value={form.stock}
                            onChange={handleChange}
                        />
                        {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <button
                        onClick={() => {
                            onClose();
                            setErrors({});
                        }}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        Tambah
                    </button>
                </div>
            </div>
        </div>
    );
}
