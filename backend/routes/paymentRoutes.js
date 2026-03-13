const express = require('express');
const axios = require('axios');
const router = express.Router();

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

console.log("Cashfree Config Check:", {
  hasAppId: !!CASHFREE_APP_ID,
  hasSecret: !!CASHFREE_SECRET_KEY,
  appIdPrefix: CASHFREE_APP_ID ? CASHFREE_APP_ID.substring(0, 4) : 'N/A'
});

router.post('/create-order', async (req, res) => {
  try {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Create the order via Cashfree PG API
    const requestBody = {
      order_id: orderId,
      order_amount: "5.00",
      order_currency: "INR",
      customer_details: {
        customer_id: String(req.body.customerId || `cust_${Date.now()}`),
        customer_name: req.body.name || "Safari User",
        customer_email: req.body.email || "user@example.com",
        customer_phone: "9876543210" 
      },
      order_meta: {
        return_url: `${(req.headers.origin || 'http://localhost:3000').replace('http://', 'https://')}/submit`
      }
    };

    console.log("Creating Cashfree Order with body:", JSON.stringify(requestBody, null, 2));

    const response = await axios.post('https://api.cashfree.com/pg/orders', requestBody, {
      headers: {
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    const errorData = error.response?.data || error.message;
    console.error("Cashfree API Failure Details:", JSON.stringify(errorData, null, 2));
    res.status(500).json({ 
      error: "Cashfree API Request Failed", 
      details: errorData,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
