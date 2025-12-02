const express = require('express');
const { Pool } = require('pg');
const net = require('net');

const app = express();

const dbPool = new Pool({
  host: 'db',
  port: 5432,
  user: 'app_user',
  password: 'app_password',
  database: 'app_db'
});

function checkCacheConnection(host, port, timeoutMs = 1000) {
  return new Promise(resolve => {
    const socket = new net.Socket();
    let finished = false;

    const done = ok => {
      if (finished) return;

      finished = true;
      socket.destroy();
      resolve(ok);
    };

    socket.setTimeout(timeoutMs);

    socket.on('connect', () => {
      console.log(`Conectou ao cache em ${host}:${port}`);
      done(true);
    });

    socket.on('timeout', () => {
      console.error(`Timeout ao conectar no cache em ${host}:${port}`);
      done(false);
    });

    socket.on('error', (err) => {
      console.error(`Erro ao conectar no cache em ${host}:${port}:`, err.message);
      done(false);
    });

    socket.connect(port, host);
  });
}

app.get('/status', async (req, res) => {
  const status = {
    web: 'ok',
    db: 'unknown',
    cache: 'unknown'
  };

  try {
    const result = await dbPool.query('SELECT 1 as ok');

    if (result.rows[0].ok === 1) {
      status.db = 'ok';
    } else {
      status.db = 'erro';
    }
  } catch (err) {
    status.db = 'erro';
  }

  try {
    const host = 'cache';
    const port = 6379;

    const cacheOk = await checkCacheConnection(host, port);

    status.cache = cacheOk ? 'ok' : 'erro';
  } catch (err) {
    status.cache = 'erro';
  }

  res.json(status);
});

app.listen(3000, () => {
  console.log(`Web rodando na porta 3000.`);
});
