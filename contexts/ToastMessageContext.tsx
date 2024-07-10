"use client";

import { Toast } from "primereact/toast";
import React, { createContext, useContext, useRef } from "react";

const ToastContext = createContext<
    | {
          showInfo: (message: string) => void;
          showError: (message: string) => void;
          showSuccess: (message: string) => void;
          showWarn: (message: string) => void;
      }
    | undefined
>(undefined);

export const ToastProvidor = ({ children }: any) => {
    const toast = useRef<Toast>(null);

    const showInfo = (message: string) => {
        toast.current?.show({ severity: "info", summary: "Info", detail: message });
    };
    const showError = (message: string) => {
        toast.current?.show({ severity: "error", summary: "error", detail: message });
    };
    const showSuccess = (message: string) => {
        toast.current?.show({ severity: "success", summary: "success", detail: message });
    };
    const showWarn = (message: string) => {
        toast.current?.show({ severity: "warn", summary: "warn", detail: message });
    };
    return (
        <ToastContext.Provider value={{ showInfo, showError, showSuccess, showWarn }}>
            <Toast position="top-right" ref={toast} />
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
