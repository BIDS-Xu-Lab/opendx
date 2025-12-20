# OpenDX

Open Diagnosis

## Frontend dev

Update the `.env` file.
```bash
cd web
cp dotenv.tpl .env
```

```bash
npm i
npx vite
```

## Backend dev

### start the API Server

Update the `.env` file.
```bash
cd api
cp dotenv.tpl .env
```


Start the server:
```bash
uv sync
uv run server.py
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

