import express from 'express';
import axios from 'axios';

const app = express();

const URL_SERVICE_1 = 'http://service_1:3001';

app.get('/report', async (req, res) => {
  try {
    const response = await axios.get(`${URL_SERVICE_1}/users`);
    const users = response.data;

    const USER_REPORT = users.map(user => {
      return `Usuário ${user.name} ativo desde ${user.active_since}`;
    });

    res.json(USER_REPORT);
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao buscar dados do service 1.' });
  }
});

app.listen(3002, () => {
  console.log(`Service 2 rodando na porta 3002`);
});
