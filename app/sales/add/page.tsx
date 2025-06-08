"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Product {
    id: number;
    name: string;
    modalPrice: number;
    sellPrice: number;
}

interface Customer {
    id: number;
    name: string;
}

interface SaleItem {
    productId: number;
    quantity: number;
}

const dummyProducts: Product[] = [
    { id: 1, name: "Oli Yamalube", modalPrice: 30000, sellPrice: 40000 },
    { id: 2, name: "Ban IRC", modalPrice: 200000, sellPrice: 250000 },
];

const dummyCustomers: Customer[] = [
    { id: 1, name: "Budi Santoso" },
    { id: 2, name: "Siti Aminah" },
];

export default function AddSalesPage() {
    const router = useRouter();
    const [customerId, setCustomerId] = useState<number | null>(null);
    const [items, setItems] = useState<SaleItem[]>([]);
    const [notaNumber, setNotaNumber] = useState("");

    useEffect(() => {
        const generateNota = () => {
            const now = new Date();
            const pad = (n: number) => n.toString().padStart(2, "0");
            const yy = now.getFullYear().toString().slice(-2);
            const mm = pad(now.getMonth() + 1);
            const dd = pad(now.getDate());
            const hh = pad(now.getHours());
            const min = pad(now.getMinutes());
            return `SALE-${yy}${mm}${dd}-${hh}${min}`;
        };
        setNotaNumber(generateNota());
    }, []);

    const addItem = () => {
        setItems([...items, { productId: dummyProducts[0].id, quantity: 1 }]);
    };

    const updateItem = (index: number, field: keyof SaleItem, value: number) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        setItems(updated);
    };

    const removeItem = (index: number) => {
        const updated = [...items];
        updated.splice(index, 1);
        setItems(updated);
    };

    const calculateTotal = () => {
        let modal = 0;
        let jual = 0;
        items.forEach((item) => {
            const product = dummyProducts.find((p) => p.id === item.productId);
            if (product) {
                modal += product.modalPrice * item.quantity;
                jual += product.sellPrice * item.quantity;
            }
        });
        return { modal, jual, margin: jual - modal };
    };

    const { modal, jual, margin } = calculateTotal();

    const handleSubmit = () => {
        if (!customerId || items.length === 0) {
            alert("Lengkapi data terlebih dahulu.");
            return;
        }

        console.log("Data yang disimpan:", {
            notaNumber,
            customerId,
            items,
        });

        alert("Penjualan disimpan (simulasi).");
        router.push("/sales");
    };

    return (
        <div className="p-6 max-w mx-auto">
            <h1 className="text-2xl font-bold mb-6">Tambah Penjualan</h1>

            {/* No Nota */}
            <div className="mb-6">
                <label className="block mb-1 font-medium text-sm">No Nota</label>
                <Input type="text" value={notaNumber} disabled />
            </div>

            {/* Select Customer */}
            <div className="mb-6">
                <label className="block mb-1 font-medium text-sm">Customer</label>
                <select
                    className="w-full border rounded px-3 py-2"
                    value={customerId ?? ""}
                    onChange={(e) => setCustomerId(+e.target.value)}
                >
                    <option value="">Pilih Customer</option>
                    {dummyCustomers.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Items Table */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">Barang Dibeli</h2>
                    <Button variant="outline" onClick={addItem}>
                        + Tambah Barang
                    </Button>
                </div>

                <div className="overflow-auto rounded border">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-xs font-semibold uppercase">
                        <tr>
                            <th className="px-4 py-3">Produk</th>
                            <th className="px-4 py-3 w-24">Jumlah</th>
                            <th className="px-4 py-3">Harga Modal</th>
                            <th className="px-4 py-3">Harga Jual</th>
                            <th className="px-4 py-3 text-center w-10">Hapus</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((item, index) => {
                            const product = dummyProducts.find((p) => p.id === item.productId);
                            return (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-3">
                                        <select
                                            className="w-full border rounded px-2 py-1"
                                            value={item.productId}
                                            onChange={(e) =>
                                                updateItem(index, "productId", +e.target.value)
                                            }
                                        >
                                            {dummyProducts.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Input
                                            type="number"
                                            min={1}
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    "quantity",
                                                    Math.max(1, +e.target.value)
                                                )
                                            }
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        Rp {((product?.modalPrice ?? 0) * item.quantity).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        Rp {((product?.sellPrice ?? 0) * item.quantity).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => removeItem(index)}>
                                            <Trash2 size={16} className="text-red-500" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                                    Tidak ada barang ditambahkan.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="border rounded p-3">
                    <p className="text-gray-500">Total Modal</p>
                    <p className="font-semibold text-base text-gray-800">
                        Rp {modal.toLocaleString()}
                    </p>
                </div>
                <div className="border rounded p-3">
                    <p className="text-gray-500">Total Jual</p>
                    <p className="font-semibold text-base text-gray-800">
                        Rp {jual.toLocaleString()}
                    </p>
                </div>
                <div className="border rounded p-3">
                    <p className="text-gray-500">Margin</p>
                    <p className={`font-semibold text-base ${margin >= 0 ? "text-green-600" : "text-red-600"}`}>
                        Rp {margin.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button onClick={handleSubmit}>Simpan</Button>
                <Button variant="outline" onClick={() => router.back()}>
                    Batal
                </Button>
            </div>
        </div>
    );
}
