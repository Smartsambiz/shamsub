const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const router = express.Router();
const pool = require('./db');

const MONNIFY_BASE_URL = "https://sandbox.monnify.com/api/v1";

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


async function getMonnifyToken() {
  const credentials = Buffer.from(`${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`).toString("base64");
  const response = await axios.post(`${MONNIFY_BASE_URL}/auth/login`, {}, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });
  return response.data.responseBody.accessToken;
}

async function createReservedAccount(userId, name, email) {
  const token = await getMonnifyToken();
  const data = {
    accountReference: `user-${userId}`,
    accountName: name,
    currencyCode: "NGN",
    contractCode: process.env.MONNIFY_CONTRACT_CODE,
    customerEmail: email,
    customerName: name,
  };

  const response = await axios.post(`${MONNIFY_BASE_URL}/bank-transfer/reserved-accounts`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.responseBody;
}

module.exports = { createReservedAccount };
C. Webhook for Wallet Funding
js
Copy
Edit
app.post("/monnify-webhook", async (req, res) => {
  const signature = req.headers["monnify-signature"];
  const body = JSON.stringify(req.body);

  const crypto = require("crypto");
  const hash = crypto.createHmac("sha512", process.env.MONNIFY_SECRET_KEY).update(body).digest("hex");

  if (hash !== signature) return res.status(401).send("Invalid signature");

  const { paymentReference, paidOn, amountPaid, accountDetails } = req.body.eventData;
  const accountReference = accountDetails.accountReference;

  const userId = parseInt(accountReference.replace("user-", ""));
  const result = await pool.query(
    `UPDATE users SET wallet_balance = wallet_balance + $1 WHERE id = $2 RETURNING *`,
    [amountPaid, userId]
  );

  // Optionally store in transactions table
  res.send("success");
});


// monnifyService.js
async function getMonnifyToken() {
  const credentials = Buffer.from(`${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`).toString("base64");
  const response = await axios.post(`${MONNIFY_BASE_URL}/auth/login`, {}, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });
  return response.data.responseBody.accessToken;
}

async function createReservedAccount(userId, name, email) {
  const token = await getMonnifyToken();
  const data = {
    accountReference: `user-${userId}`,
    accountName: name,
    currencyCode: "NGN",
    contractCode: process.env.MONNIFY_CONTRACT_CODE,
    customerEmail: email,
    customerName: name,
  };

  const response = await axios.post(`${MONNIFY_BASE_URL}/bank-transfer/reserved-accounts`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.responseBody;
}

module.exports = { createReservedAccount };



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

  const { request_id, serviceID, billersCode, variation_code, amount, phone, type, } = req.body;

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


// router for database e.g registeration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting user:', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

module.exports = router;

// ✅ Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
