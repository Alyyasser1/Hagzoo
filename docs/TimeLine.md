# Yalla Hagz — Development Timeline

## Phase 1: Planning ✅

- Defined functional and non-functional requirements
- Chose tech stack: Next.js + TypeScript + Supabase
- Designed system architecture (client/server/db layers)
- Defined data models: User, Room
- Designed API contracts: GET /api/user, GET /api/rooms
- Documented optimizations: offset pagination, embedded users in room response
- Documented security: Supabase Auth for unique email, RLS on users table
- Created system design diagram (Excalidraw)
- Finalized file structure

## Phase 2: Setup & DB connection ✅

- Next.js project initialized
- Supabase project created
- Db connection
- Middleware to verify user on protected routes using cookies
- File structure scaffolded
