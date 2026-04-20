# Hagzoo

Hagzoo is a full-stack sports social platform that connects players looking to create or join pickup games. Players create rooms with court details and a coin reward, others browse and request to join, and when the game is done the owner marks it complete — distributing coins to all accepted players automatically.

**Live Demo:** [hagzoo.vercel.app](https://hagzoo.vercel.app)

---

## The Problem

In Egypt, filling a football, padel, or tennis match is a persistent social challenge. You need enough strangers to show up at the same court, at the same time, at the right level — without relying solely on personal connections. Hagzoo solves this with a room-based coordination system.

---

## Tech Stack

| Layer      | Technology              |
| ---------- | ----------------------- |
| Framework  | Next.js 14 (App Router) |
| Language   | TypeScript              |
| Database   | Supabase (PostgreSQL)   |
| Auth       | Supabase Auth           |
| Storage    | Supabase Storage        |
| Realtime   | Supabase Realtime       |
| Forms      | React Hook Form + Zod   |
| Fonts      | Space Grotesk + DM Sans |
| Deployment | Vercel                  |

---

## Database

### Tables

- **users** — profile data synced from Supabase Auth via trigger on signup
- **rooms** — room sessions with sport, level, location, schedule, status, and coin reward
- **room_players** — junction table linking users to rooms with accept/reject status
- **rewards** — available rewards for coin redemption _(future version)_
- **redemptions** — user redemption history _(future version)_

### SQL Functions

| Function                  | Description                                                                      |
| ------------------------- | -------------------------------------------------------------------------------- |
| `create_room_with_player` | Atomically creates room and adds owner as accepted player                        |
| `join_room`               | Validates and adds player as pending with race condition protection              |
| `leave_room`              | Validates restrictions before removing player                                    |
| `delete_room`             | Validates ownership before deleting room and all its players                     |
| `complete_room`           | Marks room closed, distributes coins to all accepted players, updates user stats |

### Triggers

- `room_status_trigger` — fires after INSERT or DELETE on `room_players`, automatically flips room status between `open` and `full` based on `current_players` vs `max_players`

### Security

- Row Level Security (RLS) enabled on all tables
- Supabase Storage bucket `avatars` with RLS policies — users can only upload to their own folder (`avatars/{userId}/`)
- API routes strip protected fields (`id`, `coins`, `created_at`, `total_games_played`, `total_coins_earned`) before any update

---

## Future Versions

- Rewards and redemptions system — redeem coins for free court rentals
- Push notifications for join requests and room updates
- React Native mobile app using the same REST API

---

## Project Structure

```
hagzoo/
├── app/
│   ├── (auth)/
│   │   ├── page.tsx               # Landing page with session redirect
│   │   └── page.css
│   ├── (home)/
│   │   ├── layout.tsx             # Shared layout with auth guard + user fetch
│   │   ├── error.tsx              # Home error boundary
│   │   ├── loading.tsx            # Home skeleton
│   │   ├── not-found.tsx          # 404 handler
│   │   ├── home/
│   │   │   └── page.tsx           # Rooms grid page
│   │   └── profile/
│   │       ├── page.tsx           # Profile server component
│   │       ├── error.tsx          # Profile error boundary
│   │       ├── loading.tsx        # Profile skeleton
│   │       └── page.css
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   └── signup/route.ts
│       ├── user/
│       │   ├── route.ts           # GET, PATCH /api/user
│       │   └── rooms/route.ts     # GET /api/user/rooms
│       ├── rooms/
│       │   ├── route.ts           # GET, POST /api/rooms
│       │   └── [id]/route.ts      # GET, PATCH, DELETE /api/rooms/[id]
│       └── room-players/
│           ├── route.ts           # POST, DELETE /api/room-players
│           └── [id]/route.ts      # PATCH /api/room-players/[id]
├── components/
│   ├── auth/                      # AuthCard, AuthContainer, LoginForm, SignupForm
│   ├── layout/                    # Navbar, Footer
│   ├── rooms/                     # RoomCard, RoomModal, RoomsGrid, CreateRoomForm
│   ├── profile/                   # ProfileCard, ProfileRoomsGrid, AvatarUpload
│   └── ui/                        # Button, Input, Modal
├── services/
│   ├── userService.ts
│   └── roomService.ts
├── lib/
│   └── supabase/
│       ├── client.ts              # Browser Supabase client
│       └── server.ts              # Server Supabase client
├── types/
│   └── data.ts                    # All TypeScript types
├── utils/
│   ├── userUtils.ts               # getInitials, logout
│   └── roomUtils.ts               # formatTime
└── docs/
    ├── api/README.md
    ├── components/README.md
    └── system-design/README.md
```
