const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // 1. Read Safaricom's receipt
            const callbackData = req.body.Body.stkCallback;
            const checkoutRequestID = callbackData.CheckoutRequestID;
            const resultCode = callbackData.ResultCode;

            // 2. Check if payment was successful (ResultCode 0 is success in M-Pesa)
            if (resultCode === 0) {
                // Save to Redis (expires in 5 minutes to keep the database clean)
                await redis.set(checkoutRequestID, 'completed', 'EX', 300);
            } else {
                // User cancelled, entered wrong PIN, or failed
                await redis.set(checkoutRequestID, 'failed', 'EX', 300);
            }

            // 3. Always reply to Safaricom so they know we received the receipt
            return res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });
            
        } catch (error) {
            console.error("Callback Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
    return res.status(405).json({ error: "Method not allowed" });
}
