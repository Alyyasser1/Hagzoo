# API Documentation

## Routes Structure

### /api/auth/login

| Method | Description                                                    |
| ------ | -------------------------------------------------------------- |
| POST   | Authenticates user with email and password using Supabase Auth |

### /api/auth/signup

| Method | Description                                                           |
| ------ | --------------------------------------------------------------------- |
| POST   | Creates new Supabase Auth user and stores profile data in users table |

### /api/user

| Method | Handler        | Description                                          |
| ------ | -------------- | ---------------------------------------------------- |
| GET    | getUserById    | Fetches the authenticated user's profile             |
| PATCH  | updateUserInfo | Updates allowed user fields, strips protected fields |

### /api/user/rooms

| Method | Handler      | Description                                         |
| ------ | ------------ | --------------------------------------------------- |
| GET    | getUserRooms | Fetches all rooms the authenticated user is part of |

### /api/rooms

| Method | Handler    | Description                                                   |
| ------ | ---------- | ------------------------------------------------------------- |
| GET    | getRooms   | Fetches paginated rooms with owner info, 20 per page          |
| POST   | createRoom | Creates a room and adds creator as accepted player atomically |

### /api/rooms/[id]

| Method | Handler      | Description                                                   |
| ------ | ------------ | ------------------------------------------------------------- |
| GET    | getRoomById  | Fetches a single room with accepted and pending players       |
| PATCH  | completeRoom | Marks room complete and distributes coins to accepted players |
| DELETE | deleteRoom   | Deletes room and all its players if conditions are met        |

### /api/room-players

| Method | Handler   | Description                                                |
| ------ | --------- | ---------------------------------------------------------- |
| POST   | joinRoom  | Adds authenticated user to room as pending player          |
| DELETE | leaveRoom | Removes authenticated user from room if conditions are met |

### /api/room-players/[id]

| Method | Handler            | Description                               |
| ------ | ------------------ | ----------------------------------------- |
| PATCH  | updatePlayerStatus | Owner accepts or rejects a pending player |

---

## Services

### userService

- **getUserById** — fetches a single user by id from the users table
- **updateUserInfo** — updates allowed user fields, protected fields stripped in route
- **updatePlayerStatus** — updates a room_players record status to accepted or rejected
- **getUserRooms** — fetches all rooms a user is part of through room_players junction table

### roomService

- **getRooms** — fetches paginated rooms with owner username and avatar, returns hasMore
- **getRoomById** — fetches single room with all non-rejected players and their info embedded
- **createRoom** — calls SQL function to atomically create room and add creator as accepted
- **joinRoom** — calls SQL function to validate and add player as pending with race condition protection
- **leaveRoom** — calls SQL function to validate 24hr restriction and owner check before deleting
- **deleteRoom** — calls SQL function to validate ownership before deleting room and its players
- **completeRoom** — calls SQL function to mark room closed and distribute coins to accepted players
