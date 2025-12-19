# Supabase Postgre
# Connection pooler - disable GSSAPI to avoid negotiation errors
DATABASE_URL=postgresql://[username]:[password]@aws-0-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require&gssencmode=disable

# Supabase JWT Secret (Get this from Supabase Dashboard -> Settings -> API -> JWT Settings -> JWT Secret)
SUPABASE_JWT_SECRET=

# Agent Service URL (Default: http://localhost:8000)
AGENT_SERVICE_URL=http://localhost:8000

# Mock Chat Mode (set to 'true' to use mock responses instead of real AI model - saves costs during development)
USE_MOCK_CHAT=true