"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { BsCashCoin } from "react-icons/bs";
import * as FA from "react-icons/fa";
import { MdInventory } from "react-icons/md";

const RestaurantPage = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const { loading, onLoading, unLoading } = useLoading();

    useEffect(() => {
        if (!user) window.open("/login", "_self");
        return () => {};
    }, []);

    function handleNavigateToReport() {
        onLoading();
        router.push("/restaurant/report");
        unLoading();
    }

    function handleNavigateToProduct() {
        onLoading();
        router.push("/restaurant/product");
        unLoading();
    }

    function handleNavigateToPos() {
        onLoading();
        router.push("/restaurant/pos");
        unLoading();
    }

    if (user && !user?.restaurant) {
        return (
            <div className="p-8 text-center text-secondary-dark text-[1.2rem]">
                คุณไม่มีสิทธิ์เข้าถึงร้านใดๆ กรุณาติดต่อนักพัฒนาระบบครับ (supakorn.emch@gmail.com)
                <p className="text-blue-500 underline cursor-pointer" onClick={() => logout()}>
                    ออกจากระบบ
                </p>
            </div>
        );
    }

    return (
        user && (
            <div className="flex flex-col gap-1 p-8 sm:max-w-1/3">
                {loading && <AiOutlineLoading size={50} className="animate-spin text-primary w-full" />}
                {!loading && (
                    <>
                        <div className="flex flex-col gap-1 w-full justify-center items-center p-8">
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                                <p>ยินดีต้อนรับ! {user.name}</p>
                                <p className="text-blue-500 underline cursor-pointer" onClick={() => logout()}>
                                    ออกจากระบบ
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                            <Button
                                severity="success"
                                size="small"
                                className="col-span-1"
                                onClick={() => {
                                    handleNavigateToReport();
                                }}>
                                <div className="flex justify-center gap-2 w-full items-center">
                                    <FA.FaChartLine className="text-white" />
                                    <p className="text-white">รายงาน</p>
                                </div>
                            </Button>
                            <Button
                                severity="warning"
                                size="small"
                                className="col-span-1"
                                onClick={() => {
                                    handleNavigateToProduct();
                                }}>
                                <div className="flex justify-center gap-2 w-full items-center">
                                    <MdInventory className="text-white" />
                                    <p>สต็อก</p>
                                </div>
                            </Button>
                            <Button
                                severity="help"
                                size="small"
                                className="col-span-1"
                                onClick={() => {
                                    handleNavigateToPos();
                                }}>
                                <div className="flex justify-center gap-2 w-full items-center">
                                    <BsCashCoin className="text-white" />
                                    <p>ขายสินค้า</p>
                                </div>
                            </Button>
                        </div>
                    </>
                )}
            </div>
        )
    );
};
export default RestaurantPage;
