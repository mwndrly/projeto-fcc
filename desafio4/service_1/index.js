import express from 'express';

const app = express();

app.get('/users', (req, res) => {
  res.json([
    { id: 1, name: 'Mari', active_since: '2025-01-12' },
    { id: 2, name: 'Pedro', active_since: '2025-01-12' },
    { id: 3, name: 'Renato', active_since: '2025-01-12' }
  ]);
});

app.get('/', (req, res) => {
  res.send('Microsserviço 1 - Lista de Usuários');
});

app.listen(3001, () => {
  console.log(`Service 1 rodando na porta 3001`);
});
