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
  total_games_played: number;
  total_coins_earned: number;
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
  scheduled_date: string;
  scheduled_time: string;
  sport: "football" | "tennis" | "padel" | "padbol";
  completed: boolean;
  coins_reward: number;
};
export type RoomPlayer = {
  id: string;
  room_id: string;
  user_id: string;
  status: "pending" | "accepted" | "rejected";
  joined_at: string;
  coins_earned: number;
};
export type RoomsWithPlayers = Room & {
  users: Pick<
    User,
    "id" | "username" | "phone" | "birth_date" | "avatar_url" | "level"
  >[];
}& {
  roomPlayer:Pick<
    RoomPlayer,
    "status"|"user_id"
  >[];
}
export type RoomWithOwner = Room & {
  users: Pick<User, "username" | "avatar_url">;
};
export type CreateRoomInput = Pick<
  Room,
  | "name"
  | "location"
  | "level"
  | "max_players"
  | "sport"
  | "scheduled_date"
  | "scheduled_time"
  | "coins_reward"
>;
export type Rewards = {
  id: string;
  title: string;
  description: string;
  available: boolean;
  coins_required: number;
  created_at: string;
};
export type Redemption = {
  id: string;
  user_id: string;
  reward_id: string;
  redeemed_at: string;
  created_at: string;
};
