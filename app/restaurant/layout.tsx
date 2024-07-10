"use client";

import NavBar from "@/components/NavBar";
import { useAuth } from "@/contexts/AuthContext";

export default function RestaurantLayout({ children }: any) {
    const { user } = useAuth();
    return (
        <div className="flex flex-col gap-1 w-full">
            <NavBar />
            {children}
        </div>
    );
}
