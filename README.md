# Microsserviços & Docker

Este repositório reúne vários desafios práticos focados em **microsserviços**, **Docker**, **API Gateway**, comunicação entre containers e boas práticas de arquitetura distribuída.

Cada desafio possui sua própria pasta com:
- Código fonte organizado
- Dockerfiles individuais
- `docker-compose.yml` quando necessário
- Um README específico explicando a solução em detalhes

O README principal (este aqui) serve como índice geral do projeto.


## Estrutura do Repositório

```
├── desafio4/
│   ├── service_1/
│   ├── service_2/
│   ├── docker-compose.yml
│   └── README.md
│
├── desafio5/
│   ├── gateway/
│   ├── service_users/
│   ├── service_orders/
│   ├── docker-compose.yml
│   └── README.md
│
└── README.md (este arquivo)
```

## Desafios

### **Desafio 4 — Microsserviços Independentes**
- Dois microsserviços que se comunicam diretamente via HTTP.
- Cada serviço roda em um container separado.
- Docker Compose orquestra os serviços.
- O foco é demonstrar comunicação direta entre containers.

👉 Documentação completa dentro da pasta:
`/desafio4/README.md`

---

### **Desafio 5 — Microsserviços com API Gateway**
- Introdução de um **API Gateway** para centralizar o acesso aos serviços.
- Microsserviço de usuários, microsserviço de pedidos e gateway.
- Comunicação interna pela rede Docker (`app-net`).
- Exposição de endpoints unificados: `/users`, `/orders`.

👉 Documentação completa dentro da pasta: 
`/desafio5/README.md`


## Tecnologias Utilizadas

- **Node.js + Express**
- **Docker**
- **Docker Compose**
- **API Gateway Pattern**
- Comunicação HTTP interna entre containers
- Arquitetura modular e escalável


## Objetivo Geral

Os desafios têm como meta:

- Praticar arquitetura de microsserviços
- Simular cenários reais de comunicação entre serviços
- Aprender organização de containers e redes Docker
- Consolidar boas práticas de separação de responsabilidades


## Como Executar Qualquer Desafio

1. Entre na pasta do desafio:
   ```bash
   cd desafio4
   # ou
   cd desafio5
2. Seguir as instruções do README.md do desafio
