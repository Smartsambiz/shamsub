const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/vtpass', async (req, res) => {
  const { serviceID, phone, amount } = req.body;

  try {
    const response = await axios.post('https://sandbox.vtpass.com/api/pay', {
      serviceID,
      billersCode: phone,
      variation_code: "",
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
