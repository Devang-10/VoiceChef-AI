import express from 'express';
import cors from 'cors';
import orderRoutes from './routes/orderRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/', orderRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export default app;
