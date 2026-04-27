export type PayloadType = "category" | "product" | "category_short";

export type Payload = {
    id: number;
    name: string;
    output: string;
    type: PayloadType;
    ean?: string;
    cod_produttore?: string;
    brand?: string;
    full_desc?: string;
    model?: string;
    think?: boolean;
    sent_at?: string | null;
};