"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SideSheet } from "@/components/sidesheet";

interface PurchaseItem {
    productId: number;
    productName: string;
    quantityOrdered: number;
    price: number;
}

interface PurchaseOrder {
    id: number;
    noteNumber: string;
    supplier: string;
    orderDate: string;
    status: "draft" | "ordered" | "received" | "completed";
    items: PurchaseItem[];
    totalAmount: number;
}

export default function PurchasesPage() {
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
        {
            id: 1,
            noteNumber: "PO-20240601",
            supplier: "PT Oli Motor",
            orderDate: "2025-06-01",
            status: "ordered",
            items: [
                { productId: 1, productName: "Oli Yamalube", quantityOrdered: 5, price: 50000 },
                { productId: 2, productName: "Ban IRC", quantityOrdered: 2, price: 150000 },
            ],
            totalAmount: 550000,
        },
        {
            id: 2,
            noteNumber: "PO-20240615",
            supplier: "CV. Sumber Makmur",
            orderDate: "2025-06-15",
            status: "draft",
            items: [
                { productId: 3, productName: "Aki GS", quantityOrdered: 3, price: 250000 },
            ],
            totalAmount: 750000,
        },
    ]);

    const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

    // Filter states
    const [filterSupplier, setFilterSupplier] = useState("");
    const [filterNoteNumber, setFilterNoteNumber] = useState("");
    const [filterDateFrom, setFilterDateFrom] = useState("");

    const getStatusBadge = (status: PurchaseOrder["status"]) => {
        const colorMap: Record<string, string> = {
            draft: "bg-gray-200 text-gray-800",
            ordered: "bg-yellow-100 text-yellow-800",
            received: "bg-blue-100 text-blue-800",
            completed: "bg-green-100 text-green-800",
        };
        return (
            <span className={`px-2 py-1 rounded text-xs font-semibold ${colorMap[status]}`}>
        {status}
      </span>
        );
    };

    // Filtered purchase orders based on input
    const filteredPurchaseOrders = useMemo(() => {
        return purchaseOrders.filter((po) => {
            if (filterSupplier && !po.supplier.toLowerCase().includes(filterSupplier.toLowerCase())) {
                return false;
            }
            if (filterNoteNumber && !po.noteNumber.toLowerCase().includes(filterNoteNumber.toLowerCase())) {
                return false;
            }
            if (filterDateFrom && po.orderDate !== filterDateFrom) {
                return false;
            }
            return true;
        });
    }, [purchaseOrders, filterSupplier, filterNoteNumber, filterDateFrom]);

    // Update status dari SideSheet dropdown
    function handleStatusChange(id: number, newStatus: PurchaseOrder["status"]) {
        setPurchaseOrders((old) =>
            old.map((sale) => (sale.id === id ? { ...sale, status: newStatus } : sale))
        );
    }

    return (
        <div className="w-full min-h-screen p-6">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Purchase Orders</h1>
                <Link href="/purchases/add">
                    <Button>+ Tambah Purchase Order</Button>
                </Link>
            </header>

            {/* Filter Section */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="filterSupplier" className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier
                    </label>
                    <input
                        id="filterSupplier"
                        type="text"
                        placeholder="Masukkan nama supplier"
                        value={filterSupplier}
                        onChange={(e) => setFilterSupplier(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>

                <div>
                    <label htmlFor="filterNoteNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        No. Nota
                    </label>
                    <input
                        id="filterNoteNumber"
                        type="text"
                        placeholder="Masukkan No. Nota"
                        value={filterNoteNumber}
                        onChange={(e) => setFilterNoteNumber(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>

                <div>
                    <label htmlFor="filterDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Order
                    </label>
                    <input
                        id="filterDate"
                        type="date"
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded border shadow-sm">
                <table className="min-w-full bg-white text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-5 py-3 border-b font-medium">ID</th>
                        <th className="px-5 py-3 border-b font-medium">No. Nota</th>
                        <th className="px-5 py-3 border-b font-medium">Supplier</th>
                        <th className="px-5 py-3 border-b font-medium">Tanggal Order</th>
                        <th className="px-5 py-3 border-b font-medium">Total</th>
                        <th className="px-5 py-3 border-b font-medium">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredPurchaseOrders.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center py-6 text-gray-500 italic">
                                Belum ada purchase order.
                            </td>
                        </tr>
                    ) : (
                        filteredPurchaseOrders.map((po) => (
                            <tr key={po.id} className="border-t hover:bg-gray-50 transition">
                                <td className="px-5 py-3">{po.id}</td>
                                <td
                                    className="px-5 py-3 font-mono text-blue-600 underline cursor-pointer"
                                    onClick={() => setSelectedPO(po)}
                                >
                                    {po.noteNumber}
                                </td>
                                <td className="px-5 py-3">{po.supplier}</td>
                                <td className="px-5 py-3">{po.orderDate}</td>
                                <td className="px-5 py-3">Rp {po.totalAmount.toLocaleString("id-ID")}</td>
                                <td className="px-5 py-3">{getStatusBadge(po.status)}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Side Sheet Detail */}
            {selectedPO && (
                <SideSheet open={!!selectedPO} onClose={() => setSelectedPO(null)}>
                    {selectedPO && (
                        <div className="space-y-4 p-4">
                            {/* No Nota */}
                            <div className="space-y-1">
                                <p className="text-gray-500 uppercase text-xs font-medium tracking-wide">No. Nota</p>
                                <p className="text-gray-800 font-semibold">{selectedPO.noteNumber}</p>
                            </div>

                            {/* Supplier */}
                            <div className="space-y-1">
                                <p className="text-gray-500 uppercase text-xs font-medium tracking-wide">Supplier</p>
                                <p>{selectedPO.supplier}</p>
                            </div>

                            {/* Tanggal Order */}
                            <div className="space-y-1">
                                <p className="text-gray-500 uppercase text-xs font-medium tracking-wide">Tanggal Order</p>
                                <p>{selectedPO.orderDate}</p>
                            </div>

                            {/* Status */}
                            <div className="space-y-1">
                                <p className="text-gray-500 uppercase text-xs font-medium tracking-wide">Status</p>
                                <select
                                    value={selectedPO.status}
                                    onChange={(e) =>
                                        handleStatusChange(selectedPO.id, e.target.value as PurchaseOrder["status"])
                                    }
                                    className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold text-xs capitalize"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="ordered">Ordered</option>
                                    <option value="received">Received</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <hr className="my-4 border-gray-300" />

                            {/* Item Table */}
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Item Pembelian</h3>
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left px-3 py-1">Nama Produk</th>
                                        <th className="text-right px-3 py-1">Qty</th>
                                        <th className="text-right px-3 py-1">Harga</th>
                                        <th className="text-right px-3 py-1">Subtotal</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selectedPO.items.map((item) => (
                                        <tr key={item.productId} className="border-t">
                                            <td className="px-3 py-1">{item.productName}</td>
                                            <td className="px-3 py-1 text-right">{item.quantityOrdered}</td>
                                            <td className="px-3 py-1 text-right">
                                                Rp {item.price.toLocaleString("id-ID")}
                                            </td>
                                            <td className="px-3 py-1 text-right">
                                                Rp {(item.price * item.quantityOrdered).toLocaleString("id-ID")}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Total */}
                            <div className="mt-4 text-right font-semibold text-lg">
                                Total: Rp {selectedPO.totalAmount.toLocaleString("id-ID")}
                            </div>

                            <div className="text-right">
                                <Button variant="secondary" onClick={() => setSelectedPO(null)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </SideSheet>
            )}
        </div>
    );
}
