# OpenAI settings
OPENAI_API_KEY=sk-

# You can change to other third-party openai-compatible API endpoints
OPENAI_BASE_URL=https://api.openai.com/v1

# Supabase Postgre
# Connection pooler - disable GSSAPI to avoid negotiation errors
DATABASE_URL=postgresql://[username]:[password]@aws-0-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require&gssencmode=disable
DATABASE_SSL_CERT=prod-ca-2021.crt

# Supabase JWT Secret (Get this from Supabase Dashboard -> Settings -> API -> JWT Settings -> JWT Secret)
SUPABASE_JWT_SECRET=