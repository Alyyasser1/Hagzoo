import { User, RoomPlayer, Room, UserWithRooms, RoomWithOwner } from "../types/data";
import { createClient } from "../lib/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
export const getUserById = async (
  id: string,
): Promise<{ data: User | null; error: PostgrestError | null }> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single<User>();
  return { data, error };
};
export const updateUserInfo = async (
  id: string,
  updates: Partial<User>,
): Promise<{ data: User | null; error: PostgrestError | null }> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id)
    .select()
    .single<User>();
  return { data, error };
};
type PlayerStatus = RoomPlayer["status"];
export const updatePlayerStatus = async (
  id: string,
  status: PlayerStatus,
): Promise<{ data: RoomPlayer | null; error: PostgrestError | null }> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("room_players")
    .update({ status })
    .eq("id", id)
    .select()
    .single<RoomPlayer>();
  return { data, error };
};

interface RoomQueryResponse extends Room {
  users: Pick<User, "avatar_url" | "username"> | null;
}
 
interface UserQueryResponse extends User {
  room_players: {
    rooms: RoomQueryResponse | null;
  }[];
}
 
export const getUserWithRooms = async (
  userId: string,
): Promise<{ data: UserWithRooms | null; error: PostgrestError | null }> => {
  const supabase = await createClient();
 
  const { data, error } = await supabase
    .from("users")
    .select(`
      *,
      room_players (
        rooms (
          *,
          users (
            username,
            avatar_url
          )
        )
      )
    `)
    .eq("id", userId)
    .single();
 
  if (error || !data) return { data: null, error };
 
  const rawData = data as unknown as UserQueryResponse;
 
  const rooms: RoomWithOwner[] = rawData.room_players
    ?.map((item) => item.rooms)
    .filter((room): room is RoomQueryResponse => room !== null);
 
  const userWithRooms: UserWithRooms = {
    ...rawData,
    rooms,
  };
 
  return { data: userWithRooms, error: null };
};
