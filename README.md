# user-service

## Quick start
```bash
cp .env.example .env
docker compose -f docker-compose.snippet.yml up -d db rabbitmq
npm ci
npm run migrate:run
npm run dev
# open http://localhost:8080/docs
```
