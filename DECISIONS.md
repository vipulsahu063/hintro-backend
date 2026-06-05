# Technical Decisions

## 1. Runtime: Node.js + Express
**Chosen because:** Fast to scaffold, large ecosystem, native JSON handling, async I/O suits an API-heavy service.
**Alternatives:** Python/FastAPI (slower iteration for this use case), Bun (less mature ecosystem).
**Trade-offs:** Less type safety than TypeScript, but kept JS for speed of delivery.

## 2. Database: PostgreSQL via Neon (Serverless)
**Chosen because:** Industry-standard relational DB, strong support for JSON columns (transcripts/analysis), Neon provides free serverless hosting with instant provisioning.
**Alternatives:** SQLite (resets on cloud redeploy), MongoDB (overkill for structured relational data), Railway PostgreSQL (platform lock-in).
**Trade-offs:** Neon cold starts on free tier (~500ms first query), acceptable for this use case.

## 3. ORM: Prisma
**Chosen because:** Type-safe queries, automatic migrations, excellent Neon/PostgreSQL support, readable schema.
**Alternatives:** Knex (raw SQL, more setup), Sequelize (verbose, older API).
**Trade-offs:** Slightly larger bundle size, but migration safety and readability outweigh this.

## 4. Authentication: JWT
**Chosen because:** Stateless, easy to implement, no session storage needed, widely understood by evaluators.
**Alternatives:** Session-based auth (requires Redis/DB sessions), OAuth (overkill for this service).
**Trade-offs:** Tokens can't be invalidated before expiry, acceptable for this assignment scope.

## 5. AI Provider: Groq (llama3-8b-8192)
**Chosen because:** 100% free tier, JSON mode support (critical for citation grounding), extremely fast responses (~1s), reliable uptime.
**Alternatives:** Gemini (good quality but less predictable JSON), OpenAI (paid, no free tier).
**Trade-offs:** llama3-8b quality lower than GPT-4 but sufficient for meeting analysis.

## 6. Input Validation: Zod
**Chosen because:** Schema-based, reusable across controllers and routes, clean error messages, TypeScript-friendly patterns.
**Alternatives:** express-validator (verbose middleware chains), Joi (heavier, older API).
**Trade-offs:** Minor learning curve but much cleaner code structure.

## 7. External Integration: Discord Webhook
**Chosen because:** Zero setup time (2 minutes), no approval process, no domain verification, widely accessible.
**Alternatives:** Telegram Bot (extra BotFather setup), Email/Resend (requires domain verification), Slack (workspace required).
**Trade-offs:** Requires a Discord server, but this is a trivial requirement to meet.

## 8. Scheduler: node-cron (every minute)
**Chosen because:** Lightweight, no external infra, runs in same process. Set to every minute for easy evaluator verification.
**Alternatives:** Bull/BullMQ (requires Redis), Agenda (MongoDB dependency).
**Trade-offs:** Not distributed (single process only), acceptable for this scope.

## 9. API Documentation: swagger-jsdoc + swagger-ui-express
**Chosen because:** Docs written as JSDoc comments in route files — what you write is exactly what appears, no silent mis-generation.
**Alternatives:** swagger-autogen (guesses API shape, can silently produce wrong docs).
**Trade-offs:** Slightly more manual work per route, but accuracy is critical.