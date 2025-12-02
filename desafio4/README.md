  # Desafio 4 — Microsserviços Independentes

Este projeto implementa dois microsserviços independentes que se comunicam via HTTP, cada um rodando em seu próprio container Docker.

- **Microsserviço 1 (`service_1`)**: expõe uma lista de usuários em JSON.
- **Microsserviço 2 (`service_2`)**: consome o `service_1` via HTTP e exibe as informações combinadas.

A comunicação é feita diretamente entre os serviços, sem API Gateway.

---

## 1. Arquitetura, solução e decisões técnicas

### Visão geral

A arquitetura é composta por:

- **2 microsserviços Node.js + Express**, isolados em pastas distintas:
  - `service_1/`: provê dados de usuários.
  - `service_2/`: consome os dados de `service_1` e monta um “relatório” legível.
- **Docker**:
  - Cada serviço tem seu próprio `dockerfile`.
  - O `docker-compose.yml` orquestra a subida dos containers e faz o binding de portas.
- **Comunicação entre microsserviços**:
  - Feita via HTTP interno da rede Docker.
  - O `service_2` acessa o `service_1` usando o nome do serviço definido no `docker-compose` (ex.: `http://service_1:3001`).

### Decisões técnicas

- **Node.js + Express**:
  - Rápido de subir, fácil de ler e revisar em contexto de desafio técnico.
- **Axios (no service_2)**:
  - Simplifica o consumo HTTP do `service_1`.
- **Docker por serviço**:
  - Cada microsserviço tem sua própria imagem, facilitando evolução e deploy independente.
- **Rede Docker default / nomeada**:
  - O `docker-compose` já cria uma rede interna onde os serviços se enxergam pelo nome.
  - Isso simula bem um cenário real de microsserviços em containers.

---

## 2. Funcionamento detalhado

### Microsserviço 1 — `service_1`

- **Responsabilidade**: fornecer a lista de usuários.
- **Porta interna**: `3001`
- **Principais endpoints**:
  - `GET /`
    Retorna uma mensagem simples de status, ex.:
    `Microsserviço 1 - Lista de Usuários`
  - `GET /users`
    Retorna um JSON com usuários, por exemplo:

    ```json
    [
      { "id": 1, "name": "Maria", "active_since": "2022-01-10" },
      { "id": 2, "name": "João", "active_since": "2023-05-21" },
      { "id": 3, "name": "Ana", "active_since": "2024-03-01" }
    ]
    ```

Esse serviço é stateless e a lista é mockada em memória apenas para fins de demonstração.

---

### Microsserviço 2 — `service_2`

- **Responsabilidade**: consumir o `service_1` e gerar um relatório combinando dados.
- **Porta interna**: `3002`
- **Configuração importante**:
  - Usa uma variável de ambiente (ex.: `SERVICE_1_URL`) para apontar para o microsserviço 1 dentro da rede Docker, algo como:
    ```env
    SERVICE_1_URL=http://service_1:3001
    ```
- **Fluxo principal**:
  - Recebe requisição em `GET /report`.
  - Faz uma chamada HTTP:
    ```txt
    GET http://service_1:3001/users
    ```
  - Recebe a lista de usuários.
  - Transforma em frases do tipo:
    ```txt
    "Usuário Maria ativo desde 2022-01-10"
    ```
  - Retorna um array dessas strings em JSON.

- **Principais endpoints**:
  - `GET /report`
    Retorna um JSON parecido com:

    ```json
    [
      "Usuário Maria ativo desde 2022-01-10",
      "Usuário João ativo desde 2023-05-21",
      "Usuário Ana ativo desde 2024-03-01"
    ]
    ```

---

### Containers, rede e fluxo de comunicação

- Quando o `docker-compose` sobe:
  - É criada uma rede Docker interna, na qual os containers se resolvem pelo **nome do serviço**.
  - O container `service_1` sobe escutando na porta `3001` interna.
  - O container `service_2` sobe escutando na porta `3002` interna.
- Mapeamento de portas para a máquina host (exemplo):
  - `service_1`: `localhost:3001 -> container:3001`
  - `service_2`: `localhost:3002 -> container:3002`
- **Fluxo de uma requisição completa**:
  1. Usuário chama `GET http://localhost:3002/report`.
  2. O `service_2` recebe a requisição e faz uma chamada interna para `http://service_1:3001/users`.
  3. O `service_1` responde a lista de usuários.
  4. O `service_2` processa esses dados e devolve o relatório em JSON para quem chamou `localhost:3002`.

---

## 3. Como executar e testar

### Pré-requisitos

- Docker instalado
- Docker Compose instalado
- Estar na pasta raiz do projeto (`desafio4/`), onde está o `docker-compose.yml`.

---

### 3.1. Subir os containers

Na raiz do projeto, execute:

```bash
docker-compose up --build
