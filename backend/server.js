const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));




app.post('/api/vtpass', async (req, res) => {
  const { 
    request_id,
    serviceID, 
    billersCode,
    variation_code,
    amount,
    phone,
   } = req.body;

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
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Transaction failed" });
  }
});

app.get('/api/variations', async (req, res) => {
  const { serviceID } = req.query;
  try {
    const response = await axios.get(
      `https://sandbox.vtpass.com/api/service-variations?serviceID=${serviceID}`,
      {
        headers: {
          'api-key': process.env.VTPASS_API_KEY,
          'secret-key': process.env.VTPASS_SECRET_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data.content.variations);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch variations" });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
