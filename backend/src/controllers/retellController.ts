import { Request, Response } from 'express';
import Retell from 'retell-sdk';

const retell = new Retell({
    apiKey: process.env.RETELL_API_KEY || '',
});

export const createWebCall = async (req: Request, res: Response) => {
    try {
        const { user_id, user_email, user_name } = req.body;

        if (!user_id) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }

        const agentId = process.env.RETELL_AGENT_ID;
        if (!agentId) {
            res.status(500).json({ error: 'RETELL_AGENT_ID not configured' });
            return;
        }

        const webCallResponse = await retell.call.createWebCall({
            agent_id: agentId,
            retell_llm_dynamic_variables: {
                user_id: user_id,
                user_email: user_email,
                user_name: user_name
            },
            metadata: {
                user_id: user_id
            }
        });

        res.json(webCallResponse);
    } catch (error) {
        console.error('Error creating web call:', error);
        res.status(500).json({ error: 'Failed to create web call' });
    }
};
