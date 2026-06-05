# Hintro Meeting Intelligence Service

AI-powered backend service to manage meetings, extract insights, track action items, and send overdue reminders.

## Tech Stack
- Node.js + Express
- PostgreSQL (Neon serverless)
- Prisma ORM
- Groq LLM (llama3-8b-8192)
- Discord Webhook
- node-cron
- Zod validation
- Swagger/OpenAPI

## Setup Instructions

### 1. Clone the repo
\`\`\`bash
git clone https://github.com/yourusername/hintro-backend.git
cd hintro-backend
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Configure environment variables
\`\`\`bash
cp .env.example .env
\`\`\`

Fill in your `.env`:
| Variable | Description |
|---|---|
| PORT | Port to run server (default: 3000) |
| DATABASE_URL | Neon PostgreSQL connection string |
| JWT_SECRET | Secret key for JWT signing |
| GROQ_API_KEY | Groq API key from console.groq.com |
| DISCORD_WEBHOOK_URL | Discord channel webhook URL |
| NODE_ENV | development or production |

### 4. Run database migrations
\`\`\`bash
npx prisma migrate dev
\`\`\`

### 5. Start the server
\`\`\`bash
npm run dev       # Development (nodemon)
npm start         # Production
\`\`\`

## API Usage Examples

### Register
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
\`\`\`

### Create Meeting
\`\`\`bash
curl -X POST http://localhost:3000/api/meetings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sprint Planning",
    "participants": ["alice@example.com"],
    "meetingDate": "2026-06-01T10:00:00Z",
    "transcript": [
      {"timestamp":"00:10","speaker":"John","text":"We should launch next Friday."},
      {"timestamp":"00:20","speaker":"Alice","text":"I will prepare release notes."}
    ]
  }'
\`\`\`

### Analyze Meeting
\`\`\`bash
curl -X POST http://localhost:3000/api/meetings/MEETING_ID/analyze \
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

## Live URLs
- **API**: https://hintro-backend.onrender.com/
- **Swagger Docs**: https://hintro-backend.onrender.com/api-docs/
- **Health**: https://hintro-backend.onrender.com/health