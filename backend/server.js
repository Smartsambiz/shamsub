const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Enable CORS for your frontend
app.use(cors({
  origin: 'https://shamsub.com.ng',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ Shamsub backend is live!');
});

// ✅ Fetch service variations
app.get('/api/variations', async (req, res) => {
  const { serviceID } = req.query;

  try {
    const response = await axios.get(`https://sandbox.vtpass.com/api/service-variations?serviceID=${serviceID}`, {
      headers: {
        'api-key': process.env.VTPASS_API_KEY,
        'secret-key': process.env.VTPASS_SECRET_KEY,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data.content.variations);
  } catch (error) {
    console.error('🔴 Error fetching variations:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch variations' });
  }
});

// ✅ Process VTpass purchase
app.post('/api/vtpass', async (req, res) => {
  const { request_id, serviceID, billersCode, variation_code, amount, phone } = req.body;

  try {
    const response = await axios.post('https://sandbox.vtpass.com/api/pay', {
      request_id,
      serviceID,
      billersCode,
      variation_code,
      amount,
      phone
    }, {
      headers: {
        'api-key': process.env.VTPASS_API_KEY,
        'secret-key': process.env.VTPASS_SECRET_KEY,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('🔴 Transaction error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Transaction failed' });
  }
});

//utilities meter number verification
app.post('/api/verify-meter', async (req, res) => {
  const { serviceID, meter_number } = req.body;

  const request_id = `verify-${Date.now()}`; // You can customize this

  try {
    const response = await axios.post('https://sandbox.vtpass.com/api/merchant-verify', {
      request_id,
      serviceID,
      billersCode: meter_number
    }, {
      headers: {
        'api-key': process.env.VTPASS_API_KEY,
        'secret-key': process.env.VTPASS_SECRET_KEY,
        'Content-Type': 'application/json'
      }
    });

    const { content } = response.data;

    // Return the core data to frontend
    res.json({
      Customer_Name: content?.Customer_Name || '',
      Meter_Number: content?.Meter_Number || meter_number,
      Address: content?.Address || '',
      Raw: content // optional: include full data for debugging
    });

  } catch (error) {
    console.error('🔴 Meter verification error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Meter verification failed' });
  }
});


// ✅ Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
