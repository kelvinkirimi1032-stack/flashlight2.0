export default async function handler(req, res) {
  const body = req.body;
  const resultCode = body?.Body?.stkCallback?.ResultCode;

  if (resultCode === 0) {
    // Payment Successful (ResultCode 0)
    const callbackData = body.Body.stkCallback.CallbackMetadata.Item;
    const mpesaReceipt = callbackData.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
    
    console.log(`Payment confirmed! Receipt: ${mpesaReceipt}`);
    // Here you can save the verified status in a database or KV store
  } else {
    console.log(`Payment failed or cancelled with code: ${resultCode}`);
  }

  // Always respond with HTTP 200 to acknowledge receipt to Safaricom
  res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
}
