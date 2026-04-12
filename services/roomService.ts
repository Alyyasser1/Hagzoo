import { createClient } from "../lib/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { RoomsWithPlayers, RoomWithOwner, CreateRoomInput } from "@/types/data";
export const getRooms = async (
  offset: number,
  limit: number,
  sport:string[],
  search?: string
): Promise<{
  data: RoomWithOwner[] | null;
  error: PostgrestError | null;
  hasMore: boolean;
}> => {
  const supabase = await createClient();
  //    Gets rooms,(owner's name and avatar_url)
  let query =  supabase
    .from("rooms")
    .select("*, users!created_by(username, avatar_url)", { count: "exact" })
    .eq("completed", false)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
    // Handle filter sport query
    if(sport && sport.length > 0 && !sport.includes("All")) {
      query = query.in("sport",sport)
    }
    // Handle search name query
    if (search && search.trim() !== "") {
    query = query.ilike("name", `%${search}%`);
  }
    const {data,error,count}=await query
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
  return { id, error }
};

export const joinRoom = async (id:string):Promise<{data:string|null;error:PostgrestError|null}> => {
  const supabase = await createClient();
  const {data:{user}} =await supabase.auth.getUser()
  if (!user) return { data: null, error: null }
  const {data,error} = await supabase.rpc("join_room",{
    p_room_id:id,
    p_user_id:user.id
  })
  return {data,error}
}
export const leaveRoom = async (id:string):Promise<{data:string|null;error:PostgrestError|null}> => {
  const supabase = await createClient();
  const {data:{user}} =await supabase.auth.getUser()
  if (!user) return { data: null, error: null }
  const {data,error} = await supabase.rpc("leave_room",{
    p_room_id:id,
    p_user_id:user.id
  })
  return {data,error}
}
export const deleteRoom = async (id:string):Promise<{data:string|null;error:PostgrestError|null}> => {
  const supabase = await createClient();
  const {data:{user}} =await supabase.auth.getUser()
  if (!user) return { data: null, error: null }
  const {data,error} = await supabase.rpc("delete_room",{
    p_room_id:id,
    p_user_id:user.id
  })
  return {data,error}
}
export const completeRoom  = async (id:string):Promise<{data:string|null;error:PostgrestError|null}> => {
  const supabase = await createClient();
  const {data:{user}} =await supabase.auth.getUser()
  if (!user) return { data: null, error: null }
  const {data,error} = await supabase.rpc("complete_room",{
    p_room_id:id,
    p_user_id:user.id
  })
  return {data,error}
}
