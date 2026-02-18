export interface RetellPayload {
    event: string; // "call_analyzed" or similar
    call: {
        call_id: string;
        // Retell might send the extracted data in a specific field, e.g., 'call_analysis' or 'metadata'
        // Depending on the Prompt configuration, we expect structured data.
        // For this plan, we assume Retell sends a JSON object in a field called 'analysis' or similar,
        // or we parse the 'transcript' if needed.
        // However, Retell's "Custom Functions" or "Post Call Webhook" usually sends what we tell it to.
        // Let's assume the prompt extracts to a variable we config called 'order_details'.
        call_analysis?: {
            custom_analysis_data?: {
                items: string[];
                total: number;
                phone: string;
                name: string;
            }
        };
        // Fallback: maybe we get the phone from 'from_number'
        from_number?: string;
    };
}

export interface Order {
    id?: string;
    created_at?: string;
    items: string[]; // JSONB in DB, string[] here
    customer_phone: string;
    customer_name?: string;
    total_price: number;
    status: 'pending' | 'completed';
}
