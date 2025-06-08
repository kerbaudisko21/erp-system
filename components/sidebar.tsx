"use client";

import {Home, Boxes, ShoppingCart, PackageSearch} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex w-64 bg-white border-r shadow-sm flex-col">
            <div className="p-6 font-bold text-xl border-b">ERPART</div>
            <nav className="flex-1 p-4 space-y-2">
                <SidebarLink href="/dashboard" icon={<Home size={18}/>} active={pathname.startsWith("/dashboard")}>
                    Dashboard
                </SidebarLink>
                <SidebarLink href="/products" icon={<Boxes size={18}/>} active={pathname.startsWith("/products")}>
                    Produk
                </SidebarLink>
                <SidebarLink href="/purchases" icon={<ShoppingCart size={18}/>}
                             active={pathname.startsWith("/purchases")}>
                    Pembelian
                </SidebarLink>
                <SidebarLink href="/sales" icon={<ShoppingCart size={18}/>}
                             active={pathname.startsWith("/sales")}>
                    Penjualan
                </SidebarLink>
                <SidebarLink href="/inventory" icon={<PackageSearch size={18}/>}
                             active={pathname.startsWith("/inventory")}>
                    Inventory
                </SidebarLink>
            </nav>
        </aside>
    );
};

const SidebarLink = ({
                         href,
                         icon,
                         children,
                         active,
                     }: {
    href: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    active?: boolean;
}) => (
    <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors ${
            active
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "text-gray-700 hover:bg-gray-100"
        }`}
    >
        {icon}
        {children}
    </Link>
);

export default Sidebar;
