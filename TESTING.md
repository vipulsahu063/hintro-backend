# Testing Documentation

## Test Scenarios Executed

### Authentication
- ✅ Register with valid credentials
- ✅ Register with invalid email format — returns VALIDATION_ERROR
- ✅ Register with duplicate email — returns CONFLICT
- ✅ Login with correct credentials — returns JWT token
- ✅ Login with wrong password — returns AUTH_ERROR
- ✅ Access protected route without token — returns UNAUTHORIZED

### Meeting Management
- ✅ Create meeting with valid transcript
- ✅ Create meeting with invalid participant email — returns VALIDATION_ERROR
- ✅ Get meeting by ID — returns meeting with action items
- ✅ Get meeting with wrong user ID — returns NOT_FOUND
- ✅ List meetings with pagination (?page=1&limit=5)

### AI Analysis
- ✅ Analyze meeting — returns summary, actionItems, decisions, followUpSuggestions
- ✅ All citations reference valid transcript timestamps
- ✅ No hallucinated timestamps in citations

### Action Items
- ✅ Create action item with valid meetingId
- ✅ Create action item with invalid meetingId — returns NOT_FOUND
- ✅ Update status to COMPLETED
- ✅ Update status to invalid value — returns VALIDATION_ERROR
- ✅ Filter by status, assignee, meetingId
- ✅ Get overdue items — only returns items where dueDate < now and status != COMPLETED

### Reminder Job
- ✅ Cron job fires every minute
- ✅ Discord message delivered with task, assignee, due date
- ✅ ReminderHistory record created after each send

## Edge Cases Considered
- Empty transcript array — caught by Zod validation
- Action item with no due date — excluded from overdue detection
- Meeting analyze called twice — analysis is overwritten, new action items appended
- Overdue detection when no items exist — returns empty array gracefully

## Limitations Discovered
- AI analysis on very short transcripts (1 entry) returns minimal insights
- node-cron does not retry failed Discord sends