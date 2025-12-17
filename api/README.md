# OpenDX

Open Diagnosis

# Backend Dev

# Frontend Dev

Then, go to web and install:

```bash
# macOS with Homebrew
brew install redis
brew services start redis

# Or run Redis in foreground
redis-server
```

### 3. Start the Worker

The worker listens to the Redis queue and processes cases automatically.

In one terminal:

```bash
cd api
python worker.py
```

You should see:
```
============================================================
Clinical Case Worker
============================================================

[Init] Initializing database...
[Init] Database initialized successfully

[Redis] Connecting to Redis (localhost:6379)...
[Redis] Connected successfully

[Queue] Listening to queue: 'clinical_cases'
[Queue] Current jobs in queue: 0

[Worker] Starting RQ worker...
[Worker] Press Ctrl+C to stop
============================================================
```

### 4. Start the API Server

In another terminal:

```bash
cd api
python server.py
```

The server will run on `http://localhost:5000` (or the port configured in server.py)

FastAPI provides automatic interactive API documentation:
- Swagger UI: `http://localhost:5000/docs`
- ReDoc: `http://localhost:5000/redoc`

## API Endpoints

### POST /api/create_case

Create a new clinical case.

**Request:**
```json
{
  "question": "What is the treatment for acute appendicitis?",
  "title": "Acute Appendicitis Treatment"
}
```

**Response:**
```json
{
  "case_id": "uuid",
  "status": "CREATED",
  "title": "Acute Appendicitis Treatment",
  "created_at": "2024-01-15T10:00:00",
  "job_id": "job-uuid"
}
```

### GET /api/cases/{case_id}

Get full case data including all messages and evidence snippets.

**Response:**
```json
{
  "case_id": "uuid",
  "status": "COMPLETED",
  "title": "...",
  "messages": [...],
  "evidence_snippets": [...],
  "created_at": "...",
  "updated_at": "..."
}
```

### GET /api/cases/{case_id}/stream

Server-Sent Events endpoint for real-time updates.

**SSE Events:**
```javascript
// Status update
data: {"type": "status", "status": "PROCESSING"}

// New message
data: {"type": "message", "data": {...}}

// Done
data: {"type": "done", "status": "COMPLETED"}
```

### GET /api/cases

List all cases (for development).

## Testing

### Using curl

Create a case:
```bash
curl -X POST http://localhost:5000/api/create_case \
  -H "Content-Type: application/json" \
  -d '{"question": "How should heart failure be managed?", "title": "Heart Failure Management"}'
```

Get case:
```bash
curl http://localhost:5000/api/cases/{case_id}
```

Stream updates:
```bash
curl -N http://localhost:5000/api/cases/{case_id}/stream
```

### Using Python

```python
import requests

# Create case
response = requests.post('http://localhost:5000/api/create_case', json={
    'question': 'What is the treatment for diabetes?',
    'title': 'Diabetes Treatment'
})
case_id = response.json()['case_id']

# Get case
case = requests.get(f'http://localhost:5000/api/cases/{case_id}').json()
print(case)

# Stream updates
import sseclient
response = requests.get(f'http://localhost:5000/api/cases/{case_id}/stream', stream=True)
client = sseclient.SSEClient(response)
for event in client.events():
    print(event.data)
```

## Database Schema

### cases table
- `case_id` (PK) - Unique case identifier
- `status` - CREATED, PROCESSING, COMPLETED, ERROR
- `data_json` - JSON blob with title, etc.
- `created_at`, `updated_at` - Timestamps

### messages table
- `message_id` (PK) - Unique message identifier
- `case_id` (FK) - References cases
- `message_data_json` - JSON blob with message data
- `created_at` - Timestamp

### evidence_snippets table
- `snippet_id` (PK) - Unique snippet identifier
- `case_id` (FK) - References cases
- `snippet_data_json` - JSON blob with evidence data
- `created_at` - Timestamp

## Message Types

- **USER** - User's question
- **AGENT** - Agent's response
- **TOOL** - Tool execution result
- **SYSTEM** - System notification

## Message Stages

- **thinking** - Agent is analyzing
- **planning** - Agent is planning approach
- **tooling** - Tools are being executed
- **summarizing** - Agent is creating summary
- **final** - Final answer to user

## Workflow

1. User submits question via POST /api/create_case
2. API creates case in database with status="CREATED"
3. API enqueues job to RQ queue
4. API returns case_id to frontend
5. Frontend opens SSE connection to /api/cases/{case_id}/stream
6. Worker picks up job from queue
7. Worker updates case status to "PROCESSING"
8. Worker calls mockup agent
9. Agent yields messages and evidence snippets
10. Worker writes each to database in real-time
11. SSE endpoint polls database and streams updates to frontend
12. Worker updates status to "COMPLETED"
13. SSE endpoint sends "done" event and closes connection

## Frontend Integration

```javascript
// Create case
const response = await fetch('http://localhost:5000/api/create_case', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: 'What is the treatment for diabetes?',
    title: 'Diabetes Treatment'
  })
});
const { case_id } = await response.json();

// Setup SSE for streaming
const eventSource = new EventSource(`http://localhost:5000/api/cases/${case_id}/stream`);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'status') {
    console.log('Status:', data.status);
  } else if (data.type === 'message') {
    console.log('New message:', data.data);
    // Add message to UI
  } else if (data.type === 'done') {
    console.log('Case completed:', data.status);
    eventSource.close();
  }
};

// On page refresh, fetch full case
const caseData = await fetch(`http://localhost:5000/api/cases/${case_id}`).json();
```

## Troubleshooting

### Redis Connection Error

Make sure Redis is running:
```bash
redis-cli ping
# Should return: PONG
```

### Worker Not Processing Jobs

Check worker is running:
```bash
python worker.py
```

Check job queue status:
```bash
rq info --url redis://localhost:6379
```

Test worker directly (bypass queue):
```bash
python worker.py test test-case-123 "What is the treatment for diabetes?"
```

### Database Issues

Delete and recreate database:
```bash
rm clinical_cases.db
python -c "from database import init_db; init_db()"
```
