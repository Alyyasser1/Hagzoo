# Yalla Hagz — Development Timeline

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
- Created Postgres function for atomic room creation

## Phase 4: Backend ✅

- Defined TypeScript types: User, Room, RoomPlayer, RoomsWithPlayers,
  RoomWithOwner, CreateRoomInput, Rewards, Redemption, RoomsResponse
- userService: getUserById, updateUserInfo, updatePlayerStatus, getUserRooms
- roomService: getRooms, getRoomById, createRoom
- API routes: GET /api/rooms, POST /api/rooms, GET /api/rooms/[id]

## Phase 5: In Progress 🔄

- API routes for user services
- Remaining room services: joinRoom, leaveRoom, deleteRoom, completeRoom
- Pages and components
