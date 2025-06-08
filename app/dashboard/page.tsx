"use client";

import {Card, CardContent} from "@/components/ui/card";
import {Boxes, AlertTriangle, ShoppingBag, Plus} from "lucide-react";
import {useEffect, useState} from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

const dummyData = {
    totalProducts: 124,
    lowStock: 8,
    transactionsToday: 5,
    salesLast7Days: [
        {day: "Sen", sales: 12},
        {day: "Sel", sales: 18},
        {day: "Rab", sales: 10},
        {day: "Kam", sales: 14},
        {day: "Jum", sales: 20},
        {day: "Sab", sales: 17},
        {day: "Min", sales: 25},
    ],
    lowStockProducts: [
        {id: 1, name: "Ban Motor", stock: 3},
        {id: 2, name: "Oli Mesin", stock: 5},
        {id: 3, name: "Kampas Rem", stock: 2},
    ],
    recentTransactions: [
        {id: 1, customer: "Budi", total: 250000, status: "Selesai"},
        {id: 2, customer: "Ani", total: 175000, status: "Pending"},
        {id: 3, customer: "Joko", total: 300000, status: "Selesai"},
    ],
};

export default function Dashboard() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content left 2 cols */}
            <div className="lg:col-span-2 space-y-8">
                <SummaryCards/>
                <SalesChart/>
                <RecentTransactions/>
            </div>

            {/* Sidebar right col */}
            <div className="space-y-8">
                <LowStockList/>
                <QuickActions/>
            </div>
        </div>
    );
}

function SummaryCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
                icon={<Boxes size={28}/>}
                label="Total Produk"
                value={dummyData.totalProducts}
                color="from-blue-400 to-blue-600"
            />
            <DashboardCard
                icon={<AlertTriangle size={28}/>}
                label="Stok Menipis"
                value={dummyData.lowStock}
                color="from-yellow-400 to-yellow-600"
            />
            <DashboardCard
                icon={<ShoppingBag size={28}/>}
                label="Transaksi Hari Ini"
                value={dummyData.transactionsToday}
                color="from-green-400 to-green-600"
            />
        </div>
    );
}

function DashboardCard({
                           icon,
                           label,
                           value,
                           color,
                       }: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
}) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) return;

        const duration = 800;
        const incrementTime = Math.max(duration / end, 10);
        const timer = setInterval(() => {
            start++;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <Card
            className={`p-6 rounded-xl shadow-lg transition-transform hover:scale-[1.03] hover:shadow-xl cursor-pointer bg-white`}
        >
            <CardContent className="flex items-center gap-5">
                <div
                    className={`p-4 rounded-full bg-gradient-to-br ${color} animate-pulse text-white drop-shadow-md flex items-center justify-center`}
                    title={label}
                    aria-label={label}
                >
                    {icon}
                </div>
                <div>
                    <div className="text-3xl font-extrabold leading-none text-gray-900">
                        {count}
                    </div>
                    <div className="text-sm font-medium text-gray-500">{label}</div>
                </div>
            </CardContent>
        </Card>
    );
}

function SalesChart() {
    return (
        <Card className="p-6 rounded-xl shadow-lg bg-white">
            <CardContent>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Penjualan 7 Hari Terakhir
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={dummyData.salesLast7Days} margin={{top: 5, right: 20, left: 0, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="day"/>
                        <YAxis/>
                        <Tooltip/>
                        <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3}/>
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

function LowStockList() {
    return (
        <Card className="p-6 rounded-xl shadow-lg bg-white">
            <CardContent>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Produk Stok Menipis</h3>
                <ul className="divide-y divide-gray-200 max-h-48 overflow-auto">
                    {dummyData.lowStockProducts.map((product) => (
                        <li key={product.id} className="flex justify-between py-2">
                            <span>{product.name}</span>
                            <span className="text-yellow-600 font-semibold">{product.stock}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}

function RecentTransactions() {
    return (
        <Card className="p-6 rounded-xl shadow-lg bg-white">
            <CardContent>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Transaksi Terbaru</h3>
                <table className="w-full text-left text-gray-700">
                    <thead>
                    <tr className="border-b border-gray-200">
                        <th className="pb-2">Customer</th>
                        <th className="pb-2">Total</th>
                        <th className="pb-2">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {dummyData.recentTransactions.map((trx) => (
                        <tr key={trx.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2">{trx.customer}</td>
                            <td className="py-2">Rp {trx.total.toLocaleString("id-ID")}</td>
                            <td
                                className={`py-2 font-semibold ${
                                    trx.status === "Selesai"
                                        ? "text-green-600"
                                        : trx.status === "Pending"
                                            ? "text-yellow-600"
                                            : "text-gray-600"
                                }`}
                            >
                                {trx.status}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}

function QuickActions() {
    return (
        <Card className="p-6 rounded-xl shadow-lg bg-white">
            <CardContent>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Aksi Cepat</h3>
                <div className="flex flex-col gap-3">
                    <button
                        className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                        onClick={() => alert("Tambah Produk Baru")}
                    >
                        <Plus size={20}/>
                        Tambah Produk Baru
                    </button>
                    <button
                        className="flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
                        onClick={() => alert("Buat Order Pembelian")}
                    >
                        <ShoppingBag size={20}/>
                        Buat Order Pembelian
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}

