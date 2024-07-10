"use client";

import liff from "@line/liff";
import React, { createContext, useState, useContext, ReactNode } from "react";

export interface UserInterface {
    id: number;
    name: string;
    line_id: string;
    is_admin: boolean;
    created_at: Date;
    modified_at: Date;
    restaurant: RestaurantInterface | null;
    owner_restaurants: RestaurantInterface[] | null;
    restaurants: RestaurantInterface[] | null;
}

export interface RestaurantInterface {
    id: number;
    name: string;
    created_at: Date;
    modified_at: Date;
}

interface AuthContextType {
    user: null | UserInterface;
    login: (user: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserInterface | null>(null);

    const login = (user: UserInterface | null) => {
        if (user?.owner_restaurants?.[0] || user?.restaurants?.[0]) user["restaurant"] = (user.owner_restaurants?.[0] || user.restaurants?.[0]) as RestaurantInterface;
        setUser(user);
    };

    const logout = () => {
        setUser(null);
        liff.logout();
        window.open("/login", "_self");
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
