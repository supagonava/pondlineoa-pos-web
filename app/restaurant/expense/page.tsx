"use client";

import { useLoading } from "@/contexts/LoadingContext";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BiCheckCircle, BiPlusCircle } from "react-icons/bi";
import { FaPlusCircle } from "react-icons/fa";

interface ExpenseForm {
    description?: string;
    quantity?: number;
    unit?: string;
    price?: number;
}

const ExpensePage = () => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            quantity: 1,
            unit: "ชิ้น",
            price: 0,
        } as ExpenseForm,
    });
    const { loading, onLoading, unLoading } = useLoading();
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [expenseItems, setExpenseItems] = useState<ExpenseForm[]>([]);
    const handleSubmitExpense = async () => {};

    return (
        <div>
            <div className="flex justify-between gap-1 items-center px-2">
                <h3 className="text-xl text-primary text-center">ค่าใช้จ่าย</h3>
            </div>
            <DataTable
                header={
                    <div className="flex justify-end">
                        <Button onClick={() => setShowAddExpense(true)}>
                            <FaPlusCircle />
                        </Button>
                    </div>
                }>
                <Column filter sortable field="id" header={`Name`} />
            </DataTable>

            <Dialog
                className="w-full max-w-lg"
                header={<h1>เพิ่มรายการจ่าย</h1>}
                onHide={() => {
                    setShowAddExpense(false);
                    setExpenseItems([]);
                    reset();
                }}
                visible={showAddExpense}>
                <form onSubmit={handleSubmit((data) => setExpenseItems([...expenseItems, data as ExpenseForm]))} className="flex flex-col gap-1 py-1">
                    <Controller
                        rules={{ required: "ต้องกรอกช่องนี้" }}
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <div className="flex gap-2 items-center justify-start">
                                <label className="w-1/3">ชื่อรายจ่าย</label>
                                <InputText {...field} type="text" placeholder="ชื่อรายจ่าย" className="w-2/3" />
                            </div>
                        )}
                    />
                    {errors?.description?.message && <p className="text-red-500">{errors?.description?.message}</p>}

                    <Controller
                        rules={{ required: "ต้องกรอกช่องนี้" }}
                        control={control}
                        name="quantity"
                        render={({ field }) => (
                            <div className="flex gap-2 items-center justify-start">
                                <label className="w-1/3">จำนวน</label>
                                <InputText {...field} value={field.value ? field.value?.toString() : ""} type="number" step="0.01" placeholder="จำนวน" className="w-2/3" />
                            </div>
                        )}
                    />
                    {errors?.quantity?.message && <p className="text-red-500">{errors?.quantity?.message}</p>}

                    <Controller
                        rules={{ required: "ต้องกรอกช่องนี้" }}
                        control={control}
                        name="unit"
                        render={({ field }) => (
                            <div className="flex gap-2 items-center justify-start">
                                <label className="w-1/3">หน่วย</label>
                                <InputText {...field} type="text" placeholder="หน่วย" className="w-2/3" />
                            </div>
                        )}
                    />
                    {errors?.unit?.message && <p className="text-red-500">{errors?.unit?.message}</p>}

                    <Controller
                        rules={{ required: "ต้องกรอกช่องนี้", min: { value: 1, message: "ต้องมากกว่า 1" } }}
                        control={control}
                        name="price"
                        render={({ field }) => (
                            <div className="flex gap-2 items-center justify-start">
                                <label className="w-1/3">ราคา</label>
                                <InputText {...field} value={field.value?.toString()} type="number" step="0.01" placeholder="ราคา" className="w-2/3" />
                            </div>
                        )}
                    />
                    {errors?.price?.message && <p className="text-red-500">{errors?.price?.message}</p>}

                    <div className="flex justify-end">
                        <Button severity="success">
                            <BiPlusCircle /> เพิ่ม
                        </Button>
                    </div>
                </form>
                <DataTable value={expenseItems}>
                    <Column header={"รายการ"} field="description" />
                    <Column header={"จำนวน"} field="quantity" />
                    <Column header={"หน่วยนับ"} field="unit" />
                    <Column header={"รวมราคา"} field="price" />
                </DataTable>
                <div className="flex justify-end py-2">
                    <Button onClick={() => handleSubmitExpense()} severity="success">
                        <BiCheckCircle /> OK
                    </Button>
                </div>
                {/* <div className="w-[80vw] max-w-lg">{expenseItems.map((item, idx) => idx)}</div> */}
            </Dialog>
        </div>
    );
};
export default ExpensePage;
