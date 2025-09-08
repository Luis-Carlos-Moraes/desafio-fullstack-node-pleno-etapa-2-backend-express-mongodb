# Etapa 2 (Backend – Express + Arquivo + MongoDB)

## Desafio

Construir uma **API Express** para gerenciar **alunos**, com persistência **em arquivo** e em **MongoDB**.

**Tempo sugerido:** \~30 min
**Stack:** Node.js + Express + MongoDB (JavaScript, sem TypeScript)

## Rotas obrigatórias

### Parte 1 — Arquivo (`alunos.json`)

1. **POST `/aluno/cadastrar`**
   **Body (JSON):**

   ```json
   {
     "nome": "Maria",
     "email": "maria@example.com",
     "dataNascimento": "2000-01-01",
     "matricula": "20251234"
   }
   ```

   **Regra:** adicionar ao arquivo **`alunos.json`** (não sobrescrever; sempre acumular).

2. **GET `/aluno/listar`**
   Lê **`alunos.json`** e retorna a lista de alunos em **JSON**.

### Parte 2 — MongoDB

3. **POST `/aluno/cadastrar-db`**
   Mesmo payload do cadastro em arquivo, **salvando no MongoDB**.

4. **GET `/aluno/listar-db`**
   Retorna todos os alunos armazenados no **MongoDB** em **JSON**.

### Parte 3 — Repositório

5. Publique o código no **GitHub** (repositório público).

## Requisitos técnicos

* Tratar arquivo inexistente de forma segura (criar `alunos.json` vazio se necessário).
* Validar minimamente o payload (campos obrigatórios).
* Usar variáveis de ambiente para conexão MongoDB.

## Como começar

```bash
mkdir etapa-2-backend && cd etapa-2-backend
npm init -y
npm i express mongoose dotenv
# opcional para desenvolvimento:
npm i -D nodemon
```

Crie um script em `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```

## Estrutura sugerida

```
etapa-2-backend/
  src/
    server.js
    routes/
      aluno.routes.js
    controllers/
      aluno.controller.js
    services/
      file.service.js
      alunoDb.service.js
    models/
      Aluno.js
    utils/
      http.js
  data/
    alunos.json     (criado automaticamente se não existir)
  .env.example
  README.md
```

### `.env.example`

```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/escola
```

## Como rodar localmente

```bash
cp .env.example .env
# ajuste MONGODB_URI conforme seu ambiente
npm install
npm run dev
# API em http://localhost:3001
```

## Testes rápidos (curl)

```bash
# cadastrar em arquivo
curl -X POST http://localhost:3001/aluno/cadastrar \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria","email":"maria@example.com","dataNascimento":"2000-01-01","matricula":"20251234"}'

# listar do arquivo
curl http://localhost:3001/aluno/listar

# cadastrar no banco
curl -X POST http://localhost:3001/aluno/cadastrar-db \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@example.com","dataNascimento":"1999-05-10","matricula":"20251111"}'

# listar do banco
curl http://localhost:3001/aluno/listar-db
```

## Critérios de avaliação

* **Resolução do Problema:** rotas funcionam e atendem ao enunciado.
* **Conhecimento Técnico:** Express, file I/O, MongoDB.
* **Boas Práticas:** estrutura de pastas, código claro, status HTTP corretos, mensagens de erro úteis.
* **Documentação:** README com passos para rodar (incluindo `.env`).

## Entrega

* Publique em **repositório público** no GitHub e envie o link.

---
