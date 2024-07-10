import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Product, ProductOption } from "../pos/interface";
import { StockType } from "../pos/enum";
import { Divider } from "primereact/divider";
import { BiSave, BiTrash } from "react-icons/bi";
import { useLoading } from "@/contexts/LoadingContext";

interface ProductFormProps {
    onSubmit: (data: Product) => void;
    product?: Product;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, product }) => {
    const { loading, onLoading } = useLoading();
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Product>({
        defaultValues: product || {
            name: "ไม่ได้ระบุชื่อ",
            type: StockType.PRODUCT,
            options: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "options",
    });

    // Watch all form values
    const formValues = watch();

    return (
        <form
            onSubmit={handleSubmit(
                (values) => onSubmit(values),
                (inValid) => {},
            )}>
            <div className="p-field">
                <label htmlFor="name">ชื่อ{formValues.type && formValues.type === StockType.PRODUCT ? "สินค้า" : "วัตถุดิบ"}</label>
                <Controller
                    rules={{ required: "ต้องกรอกช่องนี้" }}
                    name="name"
                    control={control}
                    render={({ field }) => <InputText placeholder="ระบุชื่อ" className="w-full" {...field} />}
                />
                {errors.name && <small className="p-error">{errors.name.message}</small>}
            </div>
            <div className="flex justify-end gap-2 py-2">
                <Button
                    size="small"
                    type="button"
                    icon="pi pi-plus"
                    disabled={loading as boolean}
                    onClick={() =>
                        append({
                            price: 1,
                            quantity: 1,
                            type: formValues.type,
                            unit: "ชิ้น",
                            additional_cost: 0,
                            name: `ตัวเลือก ` + (fields.length + 1).toString(),
                        })
                    }
                    label="เพิ่มตัวเลือก"
                />
            </div>
            <div>
                <h3 className="text-xl">ตัวเลือกสินค้า</h3>
                {fields.length === 0 && (
                    <div className="flex justify-center p-8 border rounded-lg">
                        <label className="text-center">ไม่มีตัวเลือกกรุณากดเพิ่มตัวเลือก</label>
                    </div>
                )}
                {fields.map((field, index) => (
                    <div key={field.id} className="p-fieldset p-2 mb-1">
                        <div className="flex flex-row items-baseline mb-1">
                            <label className="w-[6rem] break-words" htmlFor={`options.${index}.name`}>
                                ชื่อตัวเลือก
                            </label>
                            <Controller rules={{ required: "ต้องกรอกช่องนี้" }} name={`options.${index}.name`} control={control} render={({ field }) => <InputText {...field} />} />
                            {errors?.[`options`]?.[index]?.name && <small className="p-error">{String(errors?.[`options`]?.[index]?.name?.message)}</small>}
                        </div>
                        <div className="flex flex-row items-baseline mb-1">
                            <label className="w-[6rem] break-words" htmlFor={`options.${index}.additional_cost`}>
                                ราคาต้นทุน
                            </label>
                            <Controller
                                rules={{ required: "ต้องกรอกช่องนี้", min: { value: 0, message: "ค่าขั้นตำ่ 0" } }}
                                name={`options.${index}.additional_cost`}
                                control={control}
                                render={({ field }) => <InputText type="number" step={0.01} {...field} value={field.value !== undefined ? field.value.toString() : ""} />}
                            />
                            {errors?.[`options`]?.[index]?.additional_cost && <small className="p-error">{String(errors?.[`options`]?.[index]?.additional_cost?.message)}</small>}
                        </div>
                        <div className="flex flex-row items-baseline mb-1">
                            <label className="w-[6rem] break-words" htmlFor={`options.${index}.quantity`}>
                                จำนวนคงคลัง
                            </label>
                            <Controller
                                rules={{ required: "ต้องกรอกช่องนี้", min: { value: 1, message: "ค่าขั้นตำ่ 1" } }}
                                name={`options.${index}.quantity`}
                                control={control}
                                render={({ field }) => <InputText type="number" step={0.01} {...field} value={field.value !== undefined ? field.value.toString() : ""} />}
                            />
                            {errors?.[`options`]?.[index]?.quantity && <small className="p-error">{String(errors?.[`options`]?.[index]?.quantity?.message)}</small>}
                        </div>
                        <div className="flex flex-row items-baseline mb-1">
                            <label className="w-[6rem] break-words" htmlFor={`options.${index}.unit`}>
                                หน่วย
                            </label>
                            <Controller rules={{ required: "ต้องกรอกช่องนี้" }} name={`options.${index}.unit`} control={control} render={({ field }) => <InputText {...field} />} />
                            {errors?.[`options`]?.[index]?.unit && <small className="p-error">{String(errors?.[`options`]?.[index]?.unit?.message)}</small>}
                        </div>
                        <div className="flex flex-row items-baseline mb-1">
                            <label className="w-[6rem] break-words" htmlFor={`options.${index}.price`}>
                                ราคาขาย
                            </label>
                            <Controller
                                rules={{ required: "ต้องกรอกช่องนี้", min: { value: 1, message: "ค่าขั้นตำ่ 1" } }}
                                name={`options.${index}.price`}
                                control={control}
                                render={({ field }) => <InputText type="number" step={0.01} {...field} value={field.value !== undefined ? field.value.toString() : ""} />}
                            />
                            {errors?.[`options`]?.[index]?.price && <small className="p-error">{String(errors?.[`options`]?.[index]?.price?.message)}</small>}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button size="small" severity="danger" type="button" icon={<BiTrash />} onClick={() => remove(index)} />
                        </div>
                    </div>
                ))}
            </div>
            <Divider />
            <div className="flex justify-end">
                <Button disabled={(loading as boolean) || fields.length === 0} type="submit" label="บันทึกสินค้า " icon={<BiSave />} />
            </div>
        </form>
    );
};
