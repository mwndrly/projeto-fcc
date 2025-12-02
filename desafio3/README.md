# Desafio 3 — Múltiplos Serviços com Docker Compose

Este desafio consiste em criar uma arquitetura com **3 serviços** orquestrados via **Docker Compose**, simulando uma aplicação real que depende de:

- Um serviço **web**
- Um **banco de dados Postgres**
- Um **cache Redis**

O objetivo é demonstrar comunicação interna entre serviços, uso de variáveis de ambiente, rede Docker e dependências entre containers.

## 1. Arquitetura da Solução

A aplicação possui três containers:

### **1. Web (Node.js + Express)**
- Porta interna: `3000`
- Exposta no host: `3003`
- A rota `/status` testa a comunicação com:
  - **Postgres** (`db`)
  - **Redis** (`cache`)

### **2. Banco de Dados (Postgres)**
- Usa a imagem oficial `postgres:16-alpine`
- Inicializado com:
  - Banco: `app_db`
  - Usuário: `app_user`
  - Senha: `app_password`

### **3. Cache (Redis)**
- Usa a imagem `redis:7-alpine`
- Comunicado via conexão TCP na porta `6379`

### **Rede Interna**

Todos os containers estão na mesma rede Docker.

Esse isolamento permite que os serviços se comuniquem usando os nomes dos serviços (`db`, `cache`, `web`) como hostnames.

## 3. Funcionamento e Fluxos

### Comunicação Web → DB

O serviço web acessa o Postgres via hostname `db`.

O teste é feito com a query:

```sql
SELECT 1
```

### Comunicação Web → Cache (Redis)

É aberta uma conexão TCP crua (`net.Socket`).

Se o socket consegue conectar, o cache está OK.

### Rota Principal

**GET** `/status`

Demonstra se os 3 serviços estão realmente comunicando.

**Exemplo de resposta:**

```json
{
  "web": "ok",
  "db": "ok",
  "cache": "ok"
}
```
## 4. Como Executar

Na pasta `desafio3/`:

### Subir os serviços

```bash
docker compose up --build
```

### Testar o serviço web

```bash
curl http://localhost:3003/status
```

### Derrubar a stack

```bash
docker compose down
```