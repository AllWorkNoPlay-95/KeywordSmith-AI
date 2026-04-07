export type PayloadType = "category" | "product";

export type Payload = {
    id: number;
    name: string;
    output: string;
    type: PayloadType;
    ean?: string;
    cod_produttore?: string;
    brand?: string;
    full_desc?: string;
};