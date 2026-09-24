const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
    // We use a GET request because the frontend is just asking for data
    if (req.method === 'GET') {
        const { id } = req.query; // This is the CheckoutRequestID

        if (!id) {
            return res.status(400).json({ error: "Missing CheckoutRequestID" });
        }

        try {
            // Check Redis for the exact ID
            const status = await redis.get(id);
            
            // If the key exists, it will be 'completed' or 'failed'. 
            // If it doesn't exist yet, we tell the frontend it is still 'pending'.
            return res.status(200).json({ status: status || 'pending' });
            
        } catch (error) {
            console.error("Redis Error:", error);
            return res.status(500).json({ error: "Database connection failed" });
        }
    }
    
    return res.status(405).json({ error: "Method not allowed" });
}

