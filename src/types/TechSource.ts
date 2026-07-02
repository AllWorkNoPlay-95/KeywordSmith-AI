export type TechSourceStatus = "found" | "not_found";

export type TechCacheRow = {
    ean: string;
    product_id: number | null;
    name: string | null;
    cod_produttore: string | null;
    brand: string | null;
    description: string | null;
    source_url: string | null;
    status: TechSourceStatus;
    confidence: number | null;
    model: string | null;
    created_at?: string;
    updated_at?: string;
};
