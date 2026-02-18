import { Request, Response } from 'express';
import { supabase } from '../supabase';
import { RetellPayload } from '../types';

export const handleRetellWebhook = async (req: Request, res: Response) => {
    try {
        const payload = req.body as RetellPayload;
        console.log('Received Retell Webhook:', JSON.stringify(payload, null, 2));

        // Basic validation
        if (!payload.call) {
            res.status(400).json({ error: 'Invalid payload' });
            return;
            // This return is crucial. Otherwise execution continues.
        }

        // Extract data
        // Note: The actual path depends on Retell's specific webhook structure for extracted data.
        // We assume 'custom_analysis_data' from our Prompt schema.
        const analysis = payload.call.call_analysis?.custom_analysis_data;
        const phone = analysis?.phone || payload.call.from_number || 'Unknown';
        const name = analysis?.name || 'Guest';
        const items = analysis?.items || [];
        let subtotal = analysis?.total || 0;

        // Logic: Sanitize & Calculate Tax
        // If subtotal is missing, maybe calculate from items? (Skipping for now as per requirements "Calculate tax-inclusive price")
        // Let's assume the Agent sends the subtotal.
        const TAX_RATE = 0.10; // 10%
        const finalPrice = Number((subtotal * (1 + TAX_RATE)).toFixed(2));

        // Store in Supabase
        const { data, error } = await supabase
            .from('orders')
            .insert([
                {
                    items: items, // Supabase handles array -> jsonb automatic conversion usually, or we stringify
                    customer_name: name,
                    customer_phone: phone,
                    total_price: finalPrice,
                    status: 'pending',
                },
            ])
            .select();

        if (error) {
            console.error('Supabase Insert Error:', error);
            res.status(500).json({ error: 'Database error' });
            return;
        }

        console.log('Order created:', data);
        res.status(200).json({ success: true, orderId: data[0].id });
    } catch (err) {
        console.error('Webhook Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
