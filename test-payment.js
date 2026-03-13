const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/payment/create-order', {
      email: "test@example.com",
      name: "Test User",
      customerId: "test_123"
    });
    console.log("Success:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

test();
