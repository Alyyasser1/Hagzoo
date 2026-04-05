import { User, RoomPlayer, Room } from "../types/data";
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
export const getUserRooms = async (
  id: string,
): Promise<{ data: Room[] | null; error: PostgrestError | null }> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("room_players")
    .select("rooms!inner(*)")
    .eq("user_id", id);
  const rooms = data?.map((item) => item.rooms) as unknown as Room[];
  return { data: rooms ?? null, error };
};
