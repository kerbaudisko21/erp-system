"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SideSheet } from "@/components/sidesheet";

interface SaleItem {
    productId: number;
    productName: string;
    quantityOrdered: number;
    price: number;
}

interface SaleOrder {
    id: number;
    noteNumber: string;
    customer: string;
    orderDate: string;
    status: "draft" | "ordered" | "delivered" | "completed";
    items: SaleItem[];
    totalAmount: number;
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-5 py-2 rounded shadow-lg animate-fadeIn">
            {message}
        </div>
    );
}

export default function SalesPage() {
    const router = useRouter();
    const [salesOrders, setSalesOrders] = useState<SaleOrder[]>([
        {
            id: 1,
            noteNumber: "SO-20240601",
            customer: "Budi Santoso",
            orderDate: "2025-06-01",
            status: "ordered",
            items: [
                { productId: 1, productName: "Sparepart A", quantityOrdered: 5, price: 100000 },
                { productId: 2, productName: "Sparepart B", quantityOrdered: 3, price: 150000 },
            ],
            totalAmount: 950000,
        },
        {
            id: 2,
            noteNumber: "SO-20240610",
            customer: "Sari Dewi",
            orderDate: "2025-06-10",
            status: "draft",
            items: [{ productId: 3, productName: "Sparepart C", quantityOrdered: 2, price: 200000 }],
            totalAmount: 400000,
        },
    ]);

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [selectedSale, setSelectedSale] = useState<SaleOrder | null>(null);

    const [filterCustomer, setFilterCustomer] = useState("");
    const [filterNoteNumber, setFilterNoteNumber] = useState("");

    const filteredSalesOrders = useMemo(() => {
        return salesOrders.filter((sale) => {
            if (filterCustomer && !sale.customer.toLowerCase().includes(filterCustomer.toLowerCase())) return false;
            if (filterNoteNumber && !sale.noteNumber.toLowerCase().includes(filterNoteNumber.toLowerCase())) return false;
            return true;
        });
    }, [salesOrders, filterCustomer, filterNoteNumber]);

    function handleStatusChange(id: number, newStatus: SaleOrder["status"]) {
        setSalesOrders((old) =>
            old.map((sale) => (sale.id === id ? { ...sale, status: newStatus } : sale))
        );
        setToastMessage(`Status sales order #${id} diubah menjadi "${newStatus}"`);
        setSelectedSale((old) => (old && old.id === id ? { ...old, status: newStatus } : old));
    }

    function handleAddSale() {
        const newSale: SaleOrder = {
            id: Date.now(),
            noteNumber: `SO-${Date.now()}`,
            customer: "Customer Baru",
            orderDate: new Date().toISOString().split("T")[0],
            status: "draft",
            items: [],
            totalAmount: 0,
        };
        setSalesOrders((prev) => [...prev, newSale]);
        setSelectedSale(newSale);
        setToastMessage("Sales Order baru berhasil dibuat.");
    }

    return (
        <div className="w-full min-h-screen p-6">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Sales Orders</h1>
                <Button onClick={() => router.push("/sales/add")}>+ Tambah Penjualan</Button>
            </div>

            {/* Filter */}
            <div className="mb-6 flex gap-4 max-w-lg">
                <input
                    type="text"
                    placeholder="Filter by Customer"
                    value={filterCustomer}
                    onChange={(e) => setFilterCustomer(e.target.value)}
                    className="border rounded px-3 py-2 flex-grow"
                />
                <input
                    type="text"
                    placeholder="Filter by No. Nota"
                    value={filterNoteNumber}
                    onChange={(e) => setFilterNoteNumber(e.target.value)}
                    className="border rounded px-3 py-2 flex-grow"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded border shadow-sm">
                <table className="min-w-full bg-white text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-5 py-3 border-b font-medium">ID</th>
                        <th className="px-5 py-3 border-b font-medium">No. Nota</th>
                        <th className="px-5 py-3 border-b font-medium">Customer</th>
                        <th className="px-5 py-3 border-b font-medium">Tanggal Order</th>
                        <th className="px-5 py-3 border-b font-medium">Total</th>
                        <th className="px-5 py-3 border-b font-medium">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredSalesOrders.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center py-6 text-gray-500 italic">
                                Tidak ada data sales order
                            </td>
                        </tr>
                    ) : (
                        filteredSalesOrders.map((sale) => (
                            <tr key={sale.id} className="border-t hover:bg-gray-50 transition">
                                <td className="px-5 py-3">{sale.id}</td>
                                <td
                                    className="px-5 py-3 text-blue-600 underline cursor-pointer"
                                    onClick={() => setSelectedSale(sale)}
                                >
                                    {sale.noteNumber}
                                </td>
                                <td className="px-5 py-3">{sale.customer}</td>
                                <td className="px-5 py-3">{sale.orderDate}</td>
                                <td className="px-5 py-3">Rp {sale.totalAmount.toLocaleString("id-ID")}</td>
                                <td className="px-5 py-3 capitalize">{sale.status}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* SideSheet Detail */}
            <SideSheet open={!!selectedSale} onClose={() => setSelectedSale(null)}>
                {selectedSale && (
                    <div className="space-y-4 p-4">
                        <div>
                            <p className="text-gray-500 text-xs uppercase">No. Nota</p>
                            <p className="font-semibold">{selectedSale.noteNumber}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase">Customer</p>
                            <p>{selectedSale.customer}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase">Tanggal Order</p>
                            <p>{selectedSale.orderDate}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase">Status</p>
                            <select
                                value={selectedSale.status}
                                onChange={(e) => handleStatusChange(selectedSale.id, e.target.value as SaleOrder["status"])}
                                className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded capitalize"
                            >
                                <option value="draft">Draft</option>
                                <option value="ordered">Ordered</option>
                                <option value="delivered">Delivered</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <hr className="border-gray-300" />

                        <div>
                            <h3 className="text-sm font-semibold mb-2">Item Penjualan</h3>
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
                                {selectedSale.items.map((item) => (
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

                        <div className="mt-4 text-right font-semibold text-lg">
                            Total: Rp {selectedSale.totalAmount.toLocaleString("id-ID")}
                        </div>

                        <div className="text-right">
                            <Button variant="secondary" onClick={() => setSelectedSale(null)}>
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </SideSheet>

            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease forwards;
                }
            `}</style>
        </div>
    );
}
