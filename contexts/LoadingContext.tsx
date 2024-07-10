"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

const LoadingContext = createContext<{ loading: Boolean; onLoading: () => void; unLoading: () => void } | undefined>(undefined);

export const LoadingProvidor = ({ children }: any) => {
    const [loading, setLoading] = useState(false);
    const onLoading = () => setLoading(true);
    const unLoading = () => setLoading(false);
    return <LoadingContext.Provider value={{ loading, onLoading, unLoading }}>{children}</LoadingContext.Provider>;
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
