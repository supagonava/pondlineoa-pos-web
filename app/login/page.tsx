"use client";

import liff from "@line/liff";
import api from "@/utils/axios";
import { useAuth } from "@/contexts/AuthContext";
import { initLiff } from "@/utils/liff";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const { login } = useAuth();
    const isInit = useRef(false);
    const router = useRouter();

    useEffect(() => {
        const initializeLiff = async () => {
            isInit.current = true;
            try {
                await initLiff();
                if (liff.isLoggedIn()) {
                    const userProfile = await liff.getProfile();
                    const userProfileResponse = await api.post("/api/user/sso-lineid", { ...userProfile });
                    login({ ...(userProfileResponse?.data || {}) });
                    if (userProfileResponse.status == 200) router.push("/restaurant");
                }
            } catch (error) {
                console.error("Error initializing LIFF", error);
            }
        };
        if (!isInit.current) initializeLiff();
    }, []);

    return <div className="flex h-screen w-screen justify-center items-center">Loading Profile...</div>;
}
