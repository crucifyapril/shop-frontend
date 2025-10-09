export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    is_available: boolean;
}

export interface ApiResponse {
    current_page: number;
    data: Product[];
    first_page_url: string | null;
    last_page: number;
    last_page_url: string | null;
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
}