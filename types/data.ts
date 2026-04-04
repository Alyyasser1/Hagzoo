export type User = {
  id: string;
  username: string;
  email: string;
  phone: string;
  birth_date: string;
  level: "beginner" | "intermediate" | "advanced" | "pro";
  coins: number;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
};
export type Room = {
  id: string;
  name: string;
  location: string;
  level: "beginner" | "intermediate" | "advanced" | "pro";
  max_players: number;
  current_players: number;
  status: "open" | "closed" | "full";
  created_by: string;
  created_at: string;
};
export type RoomPlayer = {
  id: string;
  room_id: string;
  user_id: string;
  status: "pending" | "accepted" | "rejected";
  joined_at: string;
};
export type RoomsResponse = {
  data: Room[];
  total: number;
  hasMore: boolean;
};
export type RoomsWithPlayers = Room & {
  users: Pick<
    User,
    "id" | "username" | "phone" | "birth_date" | "avatar_url" | "level"
  >[];
};
