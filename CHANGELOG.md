# Changelog

## Day 1
- Initialized Node.js + Express project
- Set up Neon PostgreSQL with Prisma ORM (4 models: User, Meeting, ActionItem, ReminderHistory)
- Implemented JWT authentication (register + login)
- Built unified API response format with traceId
- Built structured logging and global error handler
- Implemented Meeting CRUD with pagination
- Integrated Groq AI with citation grounding and hallucination prevention
- Added Swagger/OpenAPI documentation
- Added /health and /api/evaluation endpoints

## Day 2
- Built Action Item management (create, update status, filter)
- Implemented overdue detection (status != COMPLETED AND dueDate < now)
- Built Discord Webhook service
- Implemented node-cron reminder scheduler (every minute)
- Added ReminderHistory recording after each reminder
- Wrote unit tests (auth, AI citations, action items)
- Wrote all documentation (README, DECISIONS, AI_APPROACH, TESTING, CHANGELOG, CHECKLIST)
- Deployed to Render/Railway