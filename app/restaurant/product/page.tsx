"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useEffect, useRef, useState } from "react";
import { ProductForm } from "./form";
import { Product } from "../pos/interface";
import { FaPlusCircle } from "react-icons/fa";
import { StockType } from "../pos/enum";
import api from "@/utils/axios";
import { useLoading } from "@/contexts/LoadingContext";
import dayjs from "dayjs";
import { useToast } from "@/contexts/ToastMessageContext";

const RestaurantProductPage = () => {
    const { user } = useAuth();

    const initRef = useRef(false);
    const { loading, onLoading, unLoading } = useLoading();
    const [newProduct, setNewProduct] = useState<Product | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const { showSuccess, showError } = useToast();

    const initFunc = async () => {
        onLoading();
        if (!user) window.open("/login", "_self");
        const productResponse = await api.get("/api/product", { headers: { "line-id": user?.line_id }, params: { restaurant_id: user?.restaurant?.id } });
        if (productResponse.status == 200) {
            setProducts(productResponse.data);
        }
        unLoading();
    };

    const handleCreateProduct = async (productForm = {} as any) => {
        onLoading();
        const createResponse = await api.post("api/product", productForm, { headers: { "line-id": user?.line_id } });
        if (createResponse.status == 200) {
            showSuccess("สร้างสินค้าเรียบร้อยแล้ว");
            products.push(createResponse.data);
            setNewProduct(null);
        }
        setProducts([...products]);
        unLoading();
    };

    const handleUpdateProduct = async (productForm = {} as any) => {
        onLoading();
        const updateResponse = await api.patch(`api/product/${productForm.id}`, productForm, { headers: { "line-id": user?.line_id } });
        if (updateResponse.status == 200) {
            const oldRecordIDX = products.findIndex((p) => p.id === productForm.id);
            if (oldRecordIDX >= 0) {
                products[oldRecordIDX] = { ...updateResponse.data };
            }
            showSuccess("อัปเดตสินค้าเรียบร้อยแล้ว");
            setActiveIndex(null);
        }
        setProducts([...products]);
        unLoading();
    };

    async function handleDelete(id: number) {
        onLoading();
        const deleteResponse = await api.delete(`/api/product/${id}`);
        if (deleteResponse.status === 200) {
            products.splice(
                products.findIndex((p) => p.id === id),
                1,
            );
            showSuccess("ลบสำเร็จแล้ว");
        } else showError("ไม่สามารถลบรายการนี้ได้");
        setProducts([...products]);
        unLoading();
    }

    const ProductTableHeader = (
        <div className="flex justify-end items-center">
            <Button onClick={() => setNewProduct({ type: StockType.PRODUCT, restaurant: user?.restaurant } as Product)} size="small">
                <FaPlusCircle />
            </Button>
        </div>
    );

    useEffect(() => {
        if (!initRef.current) initFunc();
        return () => {};
    }, [user]);

    return (
        <div className="flex flex-col">
            <Dialog header={<h1>เพิ่มสินค้า/วัตถุดิบ</h1>} onHide={() => setNewProduct(null)} visible={newProduct !== null}>
                <div className="w-[80vw] max-w-lg">{newProduct && <ProductForm onSubmit={handleCreateProduct} product={newProduct} />}</div>
            </Dialog>

            <Dialog header={<h1>แก้ไขสินค้า/วัตถุดิบ</h1>} onHide={() => setActiveIndex(null)} visible={activeIndex !== null}>
                <div className="w-[80vw] max-w-lg">{activeIndex !== null && <ProductForm onSubmit={handleUpdateProduct} product={{ ...products[activeIndex] }} />}</div>
            </Dialog>
            <div className="p-3">
                <h3 className="text-xl text-primary text-center">ตารางสินค้า</h3>
                <DataTable
                    globalFilterFields={["name"]}
                    className="rounded-xl shadow-sm"
                    paginator
                    rows={10}
                    loading={loading as boolean}
                    defaultSortOrder={1}
                    value={products}
                    header={ProductTableHeader}>
                    <Column
                        header={`Action`}
                        body={(row, idx) => (
                            <div className="flex gap-2">
                                <Button onClick={() => setActiveIndex(idx.rowIndex)} className="h-[1.5rem]" size="small">
                                    แก้ไข
                                </Button>
                                <Button onClick={() => (confirm("คอนเฟิร์มลบ") ? handleDelete(row.id) : null)} className="h-[1.5rem]" size="small" severity="danger">
                                    ลบ
                                </Button>
                            </div>
                        )}
                    />
                    <Column filter sortable field="name" header={`Name`} />
                    <Column
                        style={{ minWidth: "8rem" }}
                        sortable
                        field="options.length"
                        body={(row) => (
                            <div className="flex flex-col">
                                {row.options.map((item: any, itemIDX: number) => (
                                    <div className="text-white bg-blue-600 my-1 rounded-lg p-1 shadow-lg text-sm" key={`product-${row.id}`}>{`${itemIDX + 1}. ${item.name} (${
                                        item.additional_cost
                                    } บาท)`}</div>
                                ))}
                            </div>
                        )}
                        header={`ต้นทุน`}
                    />
                    <Column
                        style={{ minWidth: "8rem" }}
                        sortable
                        field="options.length"
                        body={(row) => (
                            <div className="flex flex-col">
                                {row.options.map((item: any, itemIDX: number) => (
                                    <div className="text-white bg-blue-600 my-1 rounded-lg p-1 shadow-lg text-sm" key={`product-${row.id}`}>{`${itemIDX + 1}. ${item.name} (${
                                        item.price
                                    } บาท)`}</div>
                                ))}
                            </div>
                        )}
                        header={`ราคาขาย`}
                    />
                    <Column sortable field="modified_at" header={`แก้ไขเมื่อ`} body={(row) => dayjs(row.modified_at).format("DD/MM/YYYY HH:mm")} />
                </DataTable>
            </div>
        </div>
    );
};

export default RestaurantProductPage;
