"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Trash2} from "lucide-react";

type PurchaseItem = {
    productId: number;
    quantity: number;
};

type Supplier = {
    id: number;
    name: string;
};

type Product = {
    id: number;
    name: string;
    price: number;
};

const dummySuppliers: Supplier[] = [
    {id: 1, name: "CV. Sumber Makmur"},
    {id: 2, name: "PT. Sparepart Jaya"},
];

const dummyProducts: Product[] = [
    {id: 1, name: "Oli Yamalube", price: 30000},
    {id: 2, name: "Ban IRC", price: 150000},
    {id: 3, name: "Aki GS", price: 250000},
];

// Simulasi nomor nota yang sudah ada, biasanya dari backend/fetch API
const existingNotaNumbers = [
    "PO20250608-001",
    "PO20250608-002",
    // dst...
];

// Fungsi generate nomor nota otomatis
function generateNotaNumber(existingNumbers: string[]) {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const datePart = `${yyyy}${mm}${dd}`;

    // Ambil nomor urut hari ini
    const todayNumbers = existingNumbers
        .filter((no) => no.startsWith(`PO${datePart}`))
        .map((no) => no.split("-")[1]) // ambil bagian urut
        .map((num) => parseInt(num));

    const lastNumber = todayNumbers.length > 0 ? Math.max(...todayNumbers) : 0;
    const nextNumber = String(lastNumber + 1).padStart(3, "0");

    return `PO${datePart}-${nextNumber}`;
}

export default function AddPurchasePage() {
    const router = useRouter();

    // State no nota otomatis
    const [notaNumber, setNotaNumber] = useState("");

    // Data form
    const [supplierId, setSupplierId] = useState<number | null>(null);
    const [orderDate, setOrderDate] = useState("");
    const [items, setItems] = useState<PurchaseItem[]>([]);

    // Generate no nota saat page load
    useEffect(() => {
        const newNota = generateNotaNumber(existingNotaNumbers);
        setNotaNumber(newNota);
    }, []);

    const addItem = () => {
        setItems([...items, {productId: dummyProducts[0].id, quantity: 1}]);
    };

    const updateItem = (
        index: number,
        key: keyof PurchaseItem,
        value: string | number
    ) => {
        const updated = [...items];
        updated[index][key] = typeof value === "string" ? +value : value;
        setItems(updated);
    };

    const removeItem = (index: number) => {
        const updated = [...items];
        updated.splice(index, 1);
        setItems(updated);
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => {
            const product = dummyProducts.find((p) => p.id === item.productId);
            return total + (product?.price ?? 0) * item.quantity;
        }, 0);
    };

    const handleSubmit = () => {
        if (!supplierId || !orderDate || items.length === 0) {
            alert("Lengkapi data terlebih dahulu.");
            return;
        }

        console.log("Data Purchase Order:", {
            notaNumber,
            supplierId,
            orderDate,
            items,
        });

        alert("Purchase Order disimpan (simulasi)");
        router.push("/purchases");
    };

    return (
        <div className="p-6 max-w mx-auto">
            <h1 className="text-2xl font-bold mb-6">Tambah Purchase Order</h1>

            {/* No Nota */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-1">No Nota</label>
                <Input type="text" value={notaNumber} readOnly/>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Supplier</label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={supplierId ?? ""}
                        onChange={(e) => setSupplierId(+e.target.value)}
                    >
                        <option value="">Pilih Supplier</option>
                        {dummySuppliers.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Tanggal Order</label>
                    <Input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)}/>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">Daftar Produk</h2>
                    <Button variant="outline" onClick={addItem}>
                        + Tambah Produk
                    </Button>
                </div>

                <table className="w-full text-sm border rounded overflow-hidden">
                    <thead className="bg-gray-100 text-xs uppercase font-semibold">
                    <tr>
                        <th className="px-4 py-2 text-left">Produk</th>
                        <th className="px-4 py-2">Jumlah</th>
                        <th className="px-4 py-2">Harga</th>
                        <th className="px-4 py-2">Subtotal</th>
                        <th className="px-4 py-2 text-center">Hapus</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center py-4 text-gray-500">
                                Belum ada produk dipilih.
                            </td>
                        </tr>
                    )}
                    {items.map((item, index) => {
                        const product = dummyProducts.find((p) => p.id === item.productId);
                        return (
                            <tr key={index} className="border-t">
                                <td className="px-4 py-2">
                                    <select
                                        className="w-full border rounded px-2 py-1"
                                        value={item.productId}
                                        onChange={(e) => updateItem(index, "productId", e.target.value)}
                                    >
                                        {dummyProducts.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-4 py-2">
                                    <Input
                                        type="number"
                                        min={1}
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, "quantity", e.target.value)}
                                    />
                                </td>
                                <td className="px-4 py-2">Rp {product?.price.toLocaleString()}</td>
                                <td className="px-4 py-2">
                                    Rp {(product?.price ?? 0 * item.quantity).toLocaleString()}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <button onClick={() => removeItem(index)}>
                                        <Trash2 size={16} className="text-red-500"/>
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end text-right font-semibold mb-6">
                Total: Rp {calculateTotal().toLocaleString("id-ID")}
            </div>

            <div className="flex gap-4">
                <Button onClick={handleSubmit}>Simpan</Button>
                <Button variant="outline" onClick={() => router.back()}>
                    Batal
                </Button>
            </div>
        </div>
    );
}
