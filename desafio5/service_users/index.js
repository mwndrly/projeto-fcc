import express from 'express';

const app = express();

app.get('/users', (req, res) => {
  res.json([
    { id: 1, name: 'Lucas', email: 'lucas@example.com' },
    { id: 2, name: 'Manu', email: 'manu@example.com' },
    { id: 3, name: 'Ana', email: 'ana@example.com' }
  ]);
});

app.listen(3001, () => {
  console.log(`Service Users rodando na porta 3001.`);
});
