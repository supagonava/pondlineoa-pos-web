"use client";

import { useAuth } from "@/contexts/AuthContext";

const TestPage = () => {
    const { user, login, logout } = useAuth();

    return <div>USER Management</div>;
};

export default TestPage;
