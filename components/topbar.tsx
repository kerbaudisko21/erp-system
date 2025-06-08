"use client";

import {usePathname} from "next/navigation";

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/products": "Produk",
    "/purchases": "Pembelian",
    "/sales": "Penjualan",
    "/inventory": "Inventory",
};

const Topbar = () => {
    const pathname = usePathname();

    const title =
        Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] ||
        "ERPART";

    return (
        <header className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4 bg-white border-b shadow-sm">
            <h1 className="text-lg font-semibold">{title}</h1>
            <div className="text-sm text-gray-500">Welcome 👋</div>
        </header>
    );
};

export default Topbar;
