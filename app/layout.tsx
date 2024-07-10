import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PrimeReactProvider } from "primereact/api";
import { LoadingProvidor } from "@/contexts/LoadingContext";

import "./globals.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { ToastProvidor } from "@/contexts/ToastMessageContext";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
    title: "ป้าาาหิวข้าว LINE OA",
    description: "ป้าาาหิวข้าว LINE OA",
    icons: "/logo lineoa.png",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="flex min-h-screen flex-col gap-1">
                    <PrimeReactProvider>
                        <AuthProvider>
                            <ToastProvidor>
                                <LoadingProvidor>{children}</LoadingProvidor>
                            </ToastProvidor>
                        </AuthProvider>
                    </PrimeReactProvider>
                </div>
            </body>
        </html>
    );
}
