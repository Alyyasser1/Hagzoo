# Hagzoo — Development Timeline

## Phase 1: Planning ✅

- Defined functional and non-functional requirements
- Chose tech stack: Next.js + TypeScript + Supabase
- Designed system architecture (client/server/db layers)
- Defined data models: User, Room, RoomPlayer, Rewards, Redemption
- Designed API contracts: GET /api/user, GET /api/rooms, GET /api/rooms/[id]
- Documented optimizations: offset pagination, embedded users in room response
- Documented security: Supabase Auth for unique email, RLS on users table
- Created system design diagram (Excalidraw)
- Finalized file structure

## Phase 2: Setup & DB Connection ✅

- Next.js project initialized
- Supabase project created
- DB connection established (client.ts + server.ts)
- Middleware to verify user on protected routes using cookies
- File structure scaffolded
- Auth trigger created to sync Supabase Auth with public users table

## Phase 3: Database ✅

- Created tables: users, rooms, room_players, rewards, redemptions
- Enabled RLS on all tables
- Wrote RLS policies for all tables
- Enabled Realtime on rooms and room_players tables
- Created Postgres functions for atomic operations:
  - create_room_with_player
  - join_room
  - leave_room
  - delete_room
  - complete_room

## Phase 4: Backend ✅

- Defined TypeScript types: User, Room, RoomPlayer, RoomsWithPlayers,
  RoomWithOwner, CreateRoomInput, Rewards, Redemption, RoomsResponse
- userService: getUserById, updateUserInfo, updatePlayerStatus, getUserRooms
- roomService: getRooms, getRoomById, createRoom, joinRoom, leaveRoom,
  deleteRoom, completeRoom
- API Routes:
  - POST /api/auth/login
  - POST /api/auth/signup
  - GET, PATCH /api/user
  - GET /api/user/rooms
  - GET, POST /api/rooms
  - GET, PATCH, DELETE /api/rooms/[id]
  - POST, DELETE /api/room-players
  - PATCH /api/room-players/[id]
- API documentation written in docs/api/README.md

## Phase 5: Frontend ✅

- CSS variables defined for dark theme and Hagzoo brand identity
- UI components: Button, Input
- Auth components: AuthCard, AuthContainer, LoginForm, SignupForm
- Form validation with Zod + react-hook-form
- Landing page with session check and redirect

## Phase 6: In Progress 🔄

- Navbar component
- Footer component
- Home layout (shared between home and profile)
- Home page with offset-paginated rooms grid
- Profile page
