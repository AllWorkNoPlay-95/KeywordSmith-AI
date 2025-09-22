export type PayloadType = "category" | "product";

export type Payload = {
    id: number;
    name: string;
    output: string;
    type: PayloadType
};