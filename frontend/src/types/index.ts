export interface Order {
    id: string;
    created_at: string;
    items: string[];
    customer_name?: string;
    customer_phone: string;
    total_price: number;
    status: 'pending' | 'received' | 'cooking' | 'ready' | 'completed' | 'cancelled';
}
