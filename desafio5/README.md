# Desafio 5 — Microsserviços com API Gateway

Este projeto implementa uma arquitetura simples de **microsserviços** com um **API Gateway** centralizando o acesso.

Temos **3 serviços**, cada um rodando em seu próprio container Docker:

- **Microsserviço de Usuários** (`service_users`)
- **Microsserviço de Pedidos** (`service_orders`)
- **API Gateway** (`gateway`) – porta de entrada única para o cliente

---

## 1. Descrição da solução, arquitetura e decisões técnicas

### Visão geral

A arquitetura foi pensada para demonstrar:

- **Separação de responsabilidades**:
  - Um serviço só cuida de **usuários**.
  - Outro serviço só cuida de **pedidos**.
  - O gateway só coordena chamadas, não implementa regra de negócio dos domínios.
- **Comunicação via HTTP interna**:
  - Os microsserviços não são acessados diretamente pelo cliente final.
  - O cliente fala apenas com o **Gateway**.
- **Containers isolados**:
  - Cada serviço tem seu próprio `dockerfile`.
  - Todos são orquestrados via `docker-compose`.

### Decisões técnicas principais

- **Node.js + Express** para todos os serviços:
  - Simples, direto, fácil de ler e revisar em contexto de desafio.
- **Axios no API Gateway**:
  - Facilita consumo HTTP dos microsserviços.
- **Rede Docker nomeada (`app-net`)**:
  - Os serviços se resolvem por nome: `service_users`, `service_orders`.
  - O gateway usa esses nomes como hostnames.
- **Mocks em memória**:
  - Dados de usuários e pedidos são fixos (mock) para foco na arquitetura, não em persistência.

---

## 2. Arquitetura e funcionamento detalhado

### 2.1. Componentes

1. **Microsserviço 1 – Usuários (`service_users`)**
   - Porta interna: `3001`
   - Endpoint principal: `GET /users`
   - Retorna lista de usuários em JSON.

2. **Microsserviço 2 – Pedidos (`service_orders`)**
   - Porta interna: `3002`
   - Endpoint principal: `GET /orders`
   - Retorna lista de pedidos em JSON, cada pedido com um `userId`.

3. **API Gateway (`gateway`)**
   - Porta interna (e exposta): `3000`
   - Endpoints expostos ao cliente:
     - `GET /users` → chama `service_users`
     - `GET /orders` → chama `service_orders`
     - `GET /users-with-orders` → (extra) combina dados dos dois microsserviços

### 2.2. Rede Docker e comunicação

- O `docker-compose` cria uma rede chamada **`app-net`**.
- Todos os containers são ligados nessa rede.
- Isso permite que o Gateway acesse os microsserviços via:

  - `http://service_users:3001/users`
  - `http://service_orders:3002/orders`

- O cliente conhece apenas `http://localhost:3000` (o Gateway).

### 2.3. Fluxos principais

#### Fluxo `/users`

1. Cliente faz `GET http://localhost:3000/users`.
2. O Gateway recebe a requisição.
3. O Gateway faz um `GET` interno para `http://service_users:3001/users`.
4. `service_users` devolve a lista de usuários.
5. O Gateway simplesmente repassa esse JSON para o cliente.

#### Fluxo `/orders`

1. Cliente faz `GET http://localhost:3000/orders`.
2. O Gateway chama `http://service_orders:3002/orders`.
3. Recebe a lista de pedidos.
4. Devolve essa lista para o cliente.
