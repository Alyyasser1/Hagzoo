# Hagzoo — Development Timeline

## Phase 1: Planning ✅

- Defined functional and non-functional requirements
- Chose tech stack: Next.js + TypeScript + Supabase
- Designed system architecture (client/server/db layers)
- Defined data models: User, Room, RoomPlayer, Rewards, Redemption
- Designed API contracts for all routes
- Documented optimizations: offset pagination, embedded users in room response
- Documented security: Supabase Auth for unique email, RLS on users table
- Created system design diagram (Excalidraw)
- Finalized file structure
- Defined brand identity: dark theme, orange accent #E8651A, H logo mark

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

- Defined TypeScript types for all entities and API responses
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

- CSS variables for dark theme and Hagzoo brand identity
- UI components: Button (variant map), Input, Modal
- Auth: AuthCard, AuthContainer, LoginForm, SignupForm
- Form validation with Zod + react-hook-form
- Landing page with session check and redirect
- Shared layout with server-side auth + user fetch
- Navbar with avatar popup, coins display, logout
- Footer
- Home page with paginated rooms grid
- RoomCard with owner avatar, sport icon, level badge, status dot
- RoomModal with player cards, accept/reject, join/leave/delete
- CreateRoomForm with Zod validation
- Utility functions: getInitials, formatTime, logout

## Phase 6: In Progress 🔄

- Profile page
- Rewards and redemptions Modal
- Complete room feature
- Realtime subscriptions for live updates
- Mobile responsive polish
- Error boundaries
- Loading skeleton states
