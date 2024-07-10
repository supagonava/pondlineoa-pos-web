export interface Product {
    id?: number;
    type: string;
    name: string;
    options?: ProductOption[];
    restaurant?: any;
    created_at?: Date;
    modified_at?: Date;
}

export interface ProductOption {
    id?: number;
    name?: string;
    additional_cost?: number;
    quantity?: number;
    unit?: string;
    type?: string;
    price?: number;
    created_at?: Date;
    modified_at?: Date;
}

export interface ItemInterface {
    selectedProduct: Product | null;
    productOption: ProductOption | null;
    qty: number | null;
}

export interface FormInterface {
    tableNumber: string;
    orderItems: ItemInterface[];
    selectedProduct: Product | null;
    productOption: ProductOption | null;
    qty: number | null;
}
