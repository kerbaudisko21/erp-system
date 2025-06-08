"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {Mail, Lock} from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        if (email && password) {
            router.push("/dashboard");
        }
    }

    return (
        <main
            className="flex items-center justify-center min-h-screen bg-gradient-to-tr ">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in"
            >
                <div className="text-center space-y-1">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-sm text-gray-500">Masuk untuk lanjut ke dashboard</p>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20}/>
                        <input
                            type="email"
                            className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 "
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20}/>
                        <input
                            type="password"
                            className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 "
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
                >
                    Masuk
                </button>

                <p className="text-center text-xs text-gray-400">
                    © {new Date().getFullYear()} ERP Mini. All rights reserved.
                </p>
            </form>
        </main>
    );
}
