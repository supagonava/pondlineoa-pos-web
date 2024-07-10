"use client";

import { Button } from "primereact/button";
import { useEffect, useMemo, useRef, useState } from "react";
import api from "@/utils/axios";
import { useAuth } from "@/contexts/AuthContext";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FaArrowLeft, FaCheck, FaPlus } from "react-icons/fa";
import { DataTable } from "primereact/datatable";
import { Column, ColumnBodyOptions } from "primereact/column";
import { BiCart, BiCartAdd } from "react-icons/bi";
import { useMaster } from "@/utils/master";
import { FcOk } from "react-icons/fc";
import { FormInterface, Product } from "./interface";
import { useToast } from "@/contexts/ToastMessageContext";
import { useLoading } from "@/contexts/LoadingContext";
import { AiOutlineLoading } from "react-icons/ai";

function PosPage() {
    const isInit = useRef(false);
    const master = useMaster();
    const { loading, onLoading, unLoading } = useLoading();
    const { showSuccess, showError } = useToast();
    const FORM_DEFAULT_VALUE = {
        tableNumber: master.TABLE_OPTIONS[0],
        orderItems: [],
        selectedProduct: null,
        productOption: null,
        qty: 0,
    };

    const [showTable, setShowTable] = useState(false);
    const { user } = useAuth();
    const [form, setForm] = useState<FormInterface>({ ...FORM_DEFAULT_VALUE });

    const [products, setProducts] = useState<Product[]>([]);

    const productOptions = useMemo(() => {
        return form.selectedProduct?.options ?? [];
    }, [form]);

    const itemsAmount = useMemo(() => {
        return form.orderItems.reduce((prevValue: any, curr: any) => prevValue + curr.productOption.price * curr.qty, 0);
    }, [form]);

    const initFunc = async () => {
        if (!user) window.open("/login", "_self");
        const productResponse = await api.get("/api/product", { headers: { "line-id": user?.line_id }, params: { restaurant_id: user?.restaurant?.id } });
        if (productResponse.status == 200) {
            setProducts(productResponse.data);
        }
    };

    function handleAddItemToCart(): void {
        if (form.productOption && form.qty && form.selectedProduct) {
            form.orderItems.push({ productOption: form.productOption, qty: form.qty, selectedProduct: form.selectedProduct });
            form.selectedProduct = null;
            form.productOption = null;
            form.qty = 0;
            setForm({ ...form });
        } else showError("กรอกข้อมูลไม่ถูกต้อง");
    }

    function handleRemoveRow(rIdx: ColumnBodyOptions) {
        form.orderItems.splice(rIdx.rowIndex, 1);
        setForm({ ...form });
    }

    async function handleSubmitSave() {
        onLoading();
        const payload = {
            tableNumber: form.tableNumber,
            restuarant_id: user?.restaurant?.id,
            items: form.orderItems.map((item) => ({ productOptionId: item.productOption?.id, qty: item.qty })),
        };
        const apiResponse = await api.post("api/order/create-order", payload, { headers: { "line-id": user?.line_id } });
        if (apiResponse.status === 200) {
            showSuccess("บันทึกการขายเรียบร้อย!");
            setForm({ ...FORM_DEFAULT_VALUE });
            setShowTable(false);
        } else showError("บันทึกการขายล้มเหลว!");
        unLoading();
    }

    useEffect(() => {
        if (!isInit.current) {
            initFunc();
        }
        isInit.current = true;
    }, []);

    return (
        <div className="flex flex-col items-center gap-2 p-2 w-full sm:px-[25%]">
            {loading && <AiOutlineLoading size={50} className="animate-spin text-primary w-full" />}
            {!loading && (
                <>
                    <h1 className="font-bold text-2xl text-blue-500 border-b py-3 w-full text-center">หน้าขายของ</h1>
                    <p className="w-full">เลขโต๊ะ</p>
                    <Dropdown
                        editable
                        options={master.TABLE_OPTIONS}
                        disabled={showTable}
                        value={form.tableNumber}
                        onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                        className="w-full"
                        type="text"
                    />

                    {!showTable && (
                        <>
                            <p className="w-full">สินค้า</p>
                            <Dropdown
                                filter
                                placeholder="สินค้า"
                                value={form.selectedProduct}
                                onChange={(e) => setForm({ ...form, selectedProduct: e.value, productOption: null })}
                                options={products}
                                optionLabel="name"
                                optionValue="id"
                                className="w-full"
                                type="text"
                            />
                            <p className="w-full">ตัวเลือก</p>
                            <Dropdown
                                filter
                                placeholder="ตัวเลือกสินค้า"
                                value={form.productOption}
                                onChange={(e) => setForm({ ...form, productOption: e.value })}
                                disabled={!form.selectedProduct}
                                options={productOptions}
                                optionValue="id"
                                optionLabel="name"
                                itemTemplate={(item) => (item ? `${item?.name} (${item.price}.-)` : ``)}
                                valueTemplate={(item) => (form.productOption ? `${item?.name} (${item.price}.-)` : `ตัวเลือกสินค้า`)}
                                className="w-full"
                            />
                            <p className="w-full">จำนวน</p>
                            <InputText
                                step={0.01}
                                className="w-full"
                                type="number"
                                value={`${form.qty || 0}`}
                                onChange={(e) => setForm({ ...form, qty: parseFloat(e.target.value) })}
                            />
                            <p className="w-full">รวมราคา</p>
                            <InputText className="w-full" type="text" disabled={!form.productOption} value={((form.productOption?.price || 0) * (form.qty || 0)).toFixed(2)} />
                        </>
                    )}

                    <div className="flex gap-1 justify-end w-full">
                        {!showTable && (
                            <Button disabled={!form.productOption && !form.qty} onClick={() => handleAddItemToCart()} size="small">
                                <BiCartAdd size={25} />
                            </Button>
                        )}

                        {!showTable && (
                            <Button onClick={() => setShowTable(!showTable)} severity="warning" size="small">
                                <BiCart size={25} /> ({form.orderItems.length}) Total {itemsAmount.toFixed(2)}
                            </Button>
                        )}
                    </div>

                    {showTable && (
                        <div className="flex flex-col gap-2 w-full">
                            <DataTable scrollable className="w-full" value={form.orderItems}>
                                <Column
                                    header={"#"}
                                    field="selectedProduct.id"
                                    body={(row, rIdx) => (
                                        <p onClick={() => handleRemoveRow(rIdx)} className="text-red-500">
                                            ลบ
                                        </p>
                                    )}></Column>
                                <Column header={"สินค้า"} field="selectedProduct.name"></Column>
                                <Column header={"ตัวเลือก"} field="productOption.name"></Column>
                                <Column header={"ชิ้น"} field="qty"></Column>
                                <Column header={"รวม"} field="productOption.price" body={(r) => (r.productOption.price * r.qty).toFixed(2)}></Column>
                            </DataTable>
                            <div className="flex justify-end">{itemsAmount.toFixed(2)}</div>
                            <div className="flex justify-end w-full gap-1">
                                <Button onClick={() => setShowTable(!showTable)} severity="warning" size="small">
                                    <FaArrowLeft size={25} />
                                </Button>

                                <Button onClick={() => handleSubmitSave()} disabled={form.orderItems.length === 0} size="small" severity="success" outlined>
                                    <FaCheck size={25} />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default PosPage;
