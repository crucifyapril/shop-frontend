export interface Order {
    id: number;
    status_id: number;
    user_id: number;
    description: string | null;
    total_amount: number;
    created_at: string;
}

export interface ApiResponse {
    current_page: number;
    data: Order[];
    first_page_url: string | null;
    last_page: number;
    last_page_url: string | null;
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
}