import express from 'express';
import axios from 'axios';

const app = express();

const USERS_SERVICE_URL = 'http://service_users:3001';
const ORDERS_SERVICE_URL = 'http://service_orders:3002';

app.get('/users', async (req, res) => {
  try {
    const response = await axios.get(`${USERS_SERVICE_URL}/users`);

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Falha ao buscar usuários.' });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const response = await axios.get(`${ORDERS_SERVICE_URL}/orders`);

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Falha ao buscar pedidos.' });
  }
});

app.listen(3000, () => {
  console.log(`Gateway rodando na porta 3000.`);
});
