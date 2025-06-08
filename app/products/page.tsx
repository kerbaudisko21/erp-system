"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalAddProduct from "@/components/modaladdproduct";

interface Product {
    id: number;
    name: string;
    category: string;
    stock: number;
}

const dummyProducts: Product[] = [
    {id: 1, name: "Oli Yamalube", category: "oli", stock: 20},
    {id: 2, name: "Ban IRC", category: "ban", stock: 5},
    {id: 3, name: "Aki GS", category: "aki", stock: 0},
    {id: 4, name: "Filter Udara", category: "sparepart", stock: 2},
];

const ModalConfirm = ({
                          open,
                          title = "Konfirmasi",
                          message,
                          onConfirm,
                          onCancel,
                      }: {
    open: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex justify-center items-center p-4">
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
    );
};

export default function ProductPage() {
    const [products, setProducts] = useState(dummyProducts);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedStockStatus, setSelectedStockStatus] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [modalAddOpen, setModalAddOpen] = useState(false);

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setModalDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (productToDelete) {
            setProducts(products.filter((p) => p.id !== productToDelete.id));
            toast.success(`Produk '${productToDelete.name}' berhasil dihapus.`);
            setProductToDelete(null);
            setModalDeleteOpen(false);
        }
    };

    const handleCancelDelete = () => {
        setProductToDelete(null);
        setModalDeleteOpen(false);
    };

    const handleEdit = (id: number) => {
        toast.info(`Edit produk dengan ID: ${id}`);
    };

    const handleAddProduct = (newProduct: Omit<Product, "id">) => {
        const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
        setProducts([...products, {id: newId, ...newProduct}]);
        toast.success(`Produk '${newProduct.name}' berhasil ditambahkan.`);
        setModalAddOpen(false);
    };

    const filteredProducts = products
        .filter((product) => {
            if (selectedCategory && product.category !== selectedCategory) return false;
            if (selectedStockStatus === "available" && product.stock <= 5) return false;
            if (selectedStockStatus === "low" && (product.stock === 0 || product.stock > 5)) return false;
            if (selectedStockStatus === "out" && product.stock !== 0) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "name-asc") return a.name.localeCompare(b.name);
            if (sortBy === "name-desc") return b.name.localeCompare(a.name);
            if (sortBy === "stock-asc") return a.stock - b.stock;
            if (sortBy === "stock-desc") return b.stock - a.stock;
            return 0;
        });

    return (
        <div className="w-full min-h-screen p-6">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar theme="light"/>

            <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Daftar Produk</h1>

                <Button onClick={() => setModalAddOpen(true)} className="whitespace-nowrap">
                    + Tambah Produk
                </Button>
            </header>

            <section className="flex flex-wrap gap-4 items-center mb-6 px-2">
                <select
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Semua Kategori</option>
                    <option value="oli">Oli</option>
                    <option value="ban">Ban</option>
                    <option value="aki">Aki</option>
                    <option value="sparepart">Sparepart</option>
                </select>

                <select
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedStockStatus}
                    onChange={(e) => setSelectedStockStatus(e.target.value)}
                >
                    <option value="">Semua Status</option>
                    <option value="available">Tersedia (Stok &gt; 5)</option>
                    <option value="low">Menipis (1 - 5)</option>
                    <option value="out">Habis (0)</option>
                </select>

                <select
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="">Urutkan</option>
                    <option value="name-asc">Nama A-Z</option>
                    <option value="name-desc">Nama Z-A</option>
                    <option value="stock-desc">Stok Terbanyak</option>
                    <option value="stock-asc">Stok Terkecil</option>
                </select>
            </section>

            <section className="overflow-x-auto rounded border shadow-sm px-2">
                <table className="min-w-full bg-white text-sm text-left">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-5 py-3 border-b font-medium text-gray-700">Nama Produk</th>
                        <th className="px-5 py-3 border-b font-medium text-gray-700">Kategori</th>
                        <th className="px-5 py-3 border-b font-medium text-gray-700 text-right">Stok</th>
                        <th className="px-5 py-3 border-b font-medium text-gray-700 text-right">Status</th>
                        <th className="px-5 py-3 border-b font-medium text-gray-700 text-right">Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => {
                            const stockStatus =
                                product.stock === 0
                                    ? "Habis"
                                    : product.stock <= 5
                                        ? "Menipis"
                                        : "Tersedia";
                            const stockColor =
                                product.stock === 0
                                    ? "text-red-600"
                                    : product.stock <= 5
                                        ? "text-yellow-500"
                                        : "text-green-600";

                            return (
                                <tr
                                    key={product.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="px-5 py-3">{product.name}</td>
                                    <td className="px-5 py-3 capitalize">{product.category}</td>
                                    <td className="px-5 py-3 text-right font-semibold">{product.stock}</td>
                                    <td className={`px-5 py-3 text-right font-semibold ${stockColor}`}>
                                        {stockStatus}
                                    </td>
                                    <td className="px-5 py-3 text-right space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEdit(product.id)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteClick(product)}
                                        >
                                            Hapus
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td
                                colSpan={5}
                                className="text-center py-6 text-gray-500 italic"
                            >
                                Produk tidak ditemukan.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>

            <ModalConfirm
                open={modalDeleteOpen}
                message={`Apakah kamu yakin ingin menghapus produk '${productToDelete?.name}'?`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            <ModalAddProduct
                open={modalAddOpen}
                onClose={() => setModalAddOpen(false)}
                onSubmit={handleAddProduct}
            />
        </div>
    );
}
