# Supabase Postgre
# Connection pooler - disable GSSAPI to avoid negotiation errors
DATABASE_URL=postgresql://[username]:[password]@aws-0-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require&gssencmode=disable

# Supabase JWT Secret (Get this from Supabase Dashboard -> Settings -> API -> JWT Settings -> JWT Secret)
SUPABASE_JWT_SECRET=