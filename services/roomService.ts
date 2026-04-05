import { createClient } from "../lib/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { RoomsWithPlayers, RoomWithOwner, CreateRoomInput } from "@/types/data";
export const getRooms = async (
  offset: number,
  limit: number,
): Promise<{
  data: RoomWithOwner[] | null;
  error: PostgrestError | null;
  hasMore: boolean;
}> => {
  const supabase = await createClient();
  //    Gets rooms,(owner's name and avatar_url)
  const { data, error, count } = await supabase
    .from("rooms")
    .select("*, users!created_by(username, avatar_url)", { count: "exact" })
    .range(offset, offset + limit - 1);
  const hasMore = count ? offset + limit < count : false;
  return { data: (data as unknown as RoomWithOwner[]) ?? null, error, hasMore };
};
export const getRoomById = async (
  id: string,
): Promise<{ data: RoomsWithPlayers | null; error: PostgrestError | null }> => {
  const supabase = await createClient();
  // Gets room info and the (accepted,pending) players inside it and their info
  const { data, error } = await supabase
    .from("rooms")
    .select(
      "*, room_players!inner(user_id, status, users(id, username, phone, birth_date, avatar_url, level))",
    )
    .eq("id", id)
    .neq("room_players.status", "rejected")
    .single<RoomsWithPlayers>();
  return { data, error };
};
export const createRoom = async (
  roomData: CreateRoomInput,
  creator_id: string,
): Promise<{ id: string | null; error: PostgrestError | null }> => {
  const supabase = await createClient();
  const { data: id, error } = await supabase.rpc("create_room_with_player", {
    room_name: roomData.name,
    room_location: roomData.location,
    room_level: roomData.level,
    room_max_players: roomData.max_players,
    room_sport: roomData.sport,
    room_scheduled_date: roomData.scheduled_date,
    room_scheduled_time: roomData.scheduled_time,
    room_coins_reward: roomData.coins_reward,
    creator_id,
  });
  return { id, error };
};
