"use client";

import api from "@/utils/axios";
import dayjs from "dayjs";

import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";
import { useToast } from "@/contexts/ToastMessageContext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { Dialog } from "primereact/dialog";

const RestaurantReport = () => {
    const { user } = useAuth();
    const { loading, onLoading, unLoading } = useLoading();
    const { showError, showSuccess } = useToast();
    const [activeOrder, setActiveOrder] = useState<any>(null);
    const [criteriaSearch, setCriteriaSearch] = useState<{
        restaurant_id: number | null | undefined;
        date_range: Date[] | null;
    }>({
        restaurant_id: user?.restaurant?.id,
        date_range: [new Date(), new Date()],
    });
    const [dataTable, setDataTable] = useState<any[]>([]);

    const handleFetchRecords = async () => {
        onLoading();
        const orderHistorieResponse = await api.get("/api/order", {
            params: {
                restaurant_id: criteriaSearch.restaurant_id,
                start_date: dayjs(criteriaSearch?.date_range?.[0] ?? new Date())
                    .startOf("day")
                    .toISOString(),
                end_date: dayjs(criteriaSearch?.date_range?.[1] ?? new Date())
                    .endOf("day")
                    .toISOString(),
            },
        });
        if (orderHistorieResponse.status == 200) {
            setDataTable([...orderHistorieResponse.data]);
        }
        unLoading();
    };

    async function handleRemoveRow(id: number): Promise<void> {
        if (confirm("confirm delete?")) {
            const apiResponse = await api.delete(`/api/order/${id}`);
            if (apiResponse.status === 202) {
                showSuccess("ลบสำเร็จ");
                const existIndex = dataTable.findIndex((item) => item.id === id);
                dataTable.splice(existIndex, 1);
                setDataTable([...dataTable]);
            } else {
                showError("ลบไม่สำเร็จ");
            }
        }
    }

    const costAmount = useMemo(() => {
        let sum = 0;
        for (const item of dataTable) {
            sum += (Array.from(item.order_product_items) as any[]).reduce((prev, curr) => prev + (curr?.product_option?.additional_cost || 0) * curr?.quantity, 0);
        }
        return sum;
    }, [dataTable]);

    const sumAmount = useMemo(() => {
        let sum = 0;
        for (const item of dataTable) {
            sum += item.total_price;
        }
        return sum;
    }, [dataTable]);

    const sumQuantity = useMemo(() => {
        let sum = 0;
        for (const item of dataTable) {
            sum += (Array.from(item.order_product_items) as any[]).reduce((prev, curr) => prev + curr?.quantity || 0, 0);
        }
        return sum;
    }, [dataTable]);

    const profitAmount = useMemo(() => {
        let sum = 0;
        for (const item of dataTable) {
            sum += (Array.from(item.order_product_items) as any[]).reduce(
                (prev, curr) => prev + ((curr?.product_option?.price || 0) - (curr?.product_option?.additional_cost || 0)) * curr?.quantity,
                0,
            );
        }
        return sum;
    }, [dataTable]);

    useEffect(() => {
        if (!user) window.open("/login", "_self");
        return () => {};
    }, [user]);

    return (
        <div className="flex flex-col sm:p-8 p-2">
            <Dialog visible={activeOrder !== null} onHide={() => setActiveOrder(null)}>
                {activeOrder?.order_product_items && (
                    <DataTable value={activeOrder.order_product_items}>
                        <Column header={"สินค้า"} field="product.name"></Column>
                        <Column header={"ตัวเลือก"} field="product_option.name"></Column>
                        <Column header={"จำนวน"} field="quantity"></Column>
                        <Column header={"บาท"} field="quantity" body={(r: any) => ((r?.quantity ?? 0) * (r?.product_option?.price ?? 0)).toFixed(2)}></Column>
                    </DataTable>
                )}
            </Dialog>
            {loading && <AiOutlineLoading size={50} className="animate-spin text-primary w-full" />}
            {!loading && (
                <>
                    <div className="flex gap-2 items-baseline mb-1">
                        <h1 className="text-sm font-bold w-1/3">ค้นหาจากวันที่</h1>
                        <Calendar
                            showMinMaxRange
                            maxDateCount={7}
                            maxDate={new Date()}
                            className="w-full"
                            showIcon
                            value={criteriaSearch.date_range}
                            onChange={(e: any) => setCriteriaSearch({ ...criteriaSearch, date_range: e.value })}
                            selectionMode="range"
                            readOnlyInput
                            hideOnRangeSelection
                            dateFormat="dd/mm/yy"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={() => handleFetchRecords()} severity="info" size="small" className="h-[35px]">
                            <BiSearch size={25} /> ค้นหา
                        </Button>
                    </div>
                    <Divider />
                    <div className="flex flex-wrap gap-2 pt-4">
                        <div className="p-4 bg-primary text-white rounded-lg shadow-md">ยอดขาย : {sumAmount}</div>
                        <div className="p-4 bg-primary text-white rounded-lg shadow-md">ต้นทุน : {costAmount}</div>
                        <div className="p-4 bg-primary text-white rounded-lg shadow-md">กำไร : {profitAmount}</div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        <div className="p-4 bg-blue-500 text-white rounded-lg shadow-md">จำนวนชิ้น : {sumQuantity}</div>
                    </div>
                    <Divider />
                    <DataTable value={dataTable} className="w-full">
                        <Column
                            header={"#"}
                            field="selectedProduct.id"
                            body={(row, rIdx) => (
                                <p onClick={() => handleRemoveRow(row.id)} className="text-red-500">
                                    ลบ
                                </p>
                            )}></Column>
                        <Column header="เลขโต๊ะ" field="table_number"></Column>
                        <Column
                            header="จำนวนสินค้า"
                            field="items_qty"
                            body={(r) => (
                                <div onClick={() => setActiveOrder(r)} className="text-blue-500 underline">
                                    ดูรายละเอียด {(Array.from(r.order_product_items) as []).reduce((prev, curr: any) => prev + (curr?.quantity || 0), 0)}
                                </div>
                            )}></Column>
                        <Column header="ยอดรวม" field="total_price" body={(r) => r.total_price.toFixed(2)}></Column>
                        <Column header="วันที่ทำรายการ" field="created_at" body={(r) => dayjs(r.created_at).format("D/M/YYYY HH:mm")}></Column>
                    </DataTable>
                </>
            )}{" "}
        </div>
    );
};

export default RestaurantReport;
