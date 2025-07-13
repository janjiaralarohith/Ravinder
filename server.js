const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const clientId = 98255271a2d1aba7ede06467f1255289;     // Replace this
const clientSecret = cfsk_ma_prod_e4ed57b5737906ab15df448688e13b0d_288bfd79;    // Replace this

app.post("/create-order", async (req, res) => {
  const { name, email, phone, amount } = req.body;
  const orderId = "ORDER" + Date.now();

  const payload = {
    customer_details: {
      customer_id: phone,
      customer_name: name,
      customer_email: email,
      customer_phone: phone
    },
    order_amount: amount,
    order_currency: "INR",
    order_id: orderId
  };

  try {
    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2022-09-01",
          "x-client-id": clientId,
          "x-client-secret": clientSecret
        }
      }
    );

    res.json({
      order_id: orderId,
      payment_link: response.data.payment_link
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.get("/verify-order/:orderId", async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const response = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      {
        headers: {
          "x-api-version": "2022-09-01",
          "x-client-id": clientId,
          "x-client-secret": clientSecret
        }
      }
    );

    const status = response.data.order_status;
    res.json({ status }); // PAID, PENDING, FAILED
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Verification failed." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
