# MedAware - Backend

NestJS API exposing medical text classification via Minimax LLM.

## Setup

```bash
cp .env.example .env
# Edit .env: set MINIMAX_API_KEY and optionally MINIMAX_BASE_URL, PORT
npm install
npm run build
npm start
```

- **POST /classify/category** — body: `{ "text": string }`, response: `{ "category", "confidence" }`
- **Swagger** — http://localhost:3002/api-docs

## Scripts

- `npm run build` — compile with Babel
- `npm start` — run `node dist/main.js`
- `npm test` — run unit tests

## Env

- `MINIMAX_API_KEY` — required for Minimax LLM
- `MINIMAX_BASE_URL` — optional, default `https://api.minimax.io`
- `PORT` — optional, default `3002`
