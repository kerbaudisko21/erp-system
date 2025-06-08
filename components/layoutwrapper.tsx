"use client";

import {usePathname} from "next/navigation";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

export default function LayoutWrapper({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isLoginPage = pathname === "/" || pathname === "/login";

    if (isLoginPage) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-100">
                {children}
            </main>
        );
    }

    return (
        <div className="flex min-h-screen text-gray-800">
            <Sidebar/>
            <div className="flex flex-col flex-1">
                <Topbar/>
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
