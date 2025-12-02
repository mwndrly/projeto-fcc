import express from 'express';

const app = express();

app.get('/orders', (req, res) => {
  res.json([
    { id: 1, userId: 1, product: 'Notebook', value: 5000.00 },
    { id: 2, userId: 2, product: 'Teclado', value: 350.00 },
    { id: 3, userId: 3, product: 'Mouse', value: 200.00 }
  ]);
});

app.listen(3002, () => {
  console.log(`Service Orders rodando na porta 3002.`);
});
