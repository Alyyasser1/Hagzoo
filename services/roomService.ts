import { createClient } from "../lib/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import {
  RoomsWithPlayers,
  RoomWithOwner,
  CreateRoomInput,
  Room,
  RoomOwnerPreview,
  RoomPlayerPreview,
  RoomUserPreview,
} from "@/types/data";

type RoomWithOwnerRow = Room & {
  users: Pick<RoomOwnerPreview, "username" | "avatar_url"> | null;
};

type RoomWithPlayersRow = Room & {
  room_players: RoomPlayerPreview[];
};

type PlayerProfileRow = RoomUserPreview;

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
  // Gets rooms first, then resolves owners through the secure_profiles view.
  let query =  supabase
    .from("rooms")
    .select("*", { count: "exact" })
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
    const {data,error,count}=await query.returns<Room[]>()
  const hasMore = count ? offset + limit < count : false;
  if (!data || error) {
    return { data: null, error, hasMore };
  }

  const ownerIds = Array.from(new Set(data.map((room) => room.created_by)));
  const { data: ownerProfiles, error: ownerError } = await supabase
    .from("secure_profiles")
    .select("id, username, avatar_url")
    .in("id", ownerIds)
    .returns<Array<Pick<RoomOwnerPreview, "id" | "username" | "avatar_url">>>();

  if (ownerError) {
    return { data: null, error: ownerError, hasMore };
  }

  const ownersById = new Map(
    ownerProfiles?.map((profile) => [profile.id, profile]) ?? [],
  );

  const roomsWithOwners: RoomWithOwnerRow[] = data.map((room) => {
    const owner = ownersById.get(room.created_by);

    return {
      ...room,
      users: owner
        ? {
            username: owner.username,
            avatar_url: owner.avatar_url,
          }
        : null,
    };
  });

  return { data: roomsWithOwners, error: null, hasMore };
};

export const getRoomById = async (
  id: string,
): Promise<{ data: RoomsWithPlayers | null; error: PostgrestError | null }> => {
  const supabase = await createClient();
  // Gets room info and the (accepted,pending) players inside it
  const { data, error } = await supabase
    .from("rooms")
    .select("*, room_players!inner(id,user_id, status)")
    .eq("id", id)
    .neq("room_players.status", "rejected")
    .single<RoomWithPlayersRow>();
  
  if (data && !error) {
    const { room_players, ...room } = data;
    const profileIds = Array.from(
      new Set([room.created_by, ...room_players.map((rp) => rp.user_id)]),
    );
    const { data: profiles, error: profilesError } = await supabase
      .from("player_profiles")
      .select("id, username, email, phone, avatar_url, level")
      .in("id", profileIds)
      .returns<PlayerProfileRow[]>();

    if (profilesError) {
      return { data: null, error: profilesError };
    }

    const profilesById = new Map(profiles?.map((profile) => [profile.id, profile]) ?? []);
    const ownerProfile = profilesById.get(room.created_by);

    if (!ownerProfile) {
      return { data: null, error: null };
    }

    const transformed: RoomsWithPlayers = {
      ...room,
      users: room_players
        .map((rp) => profilesById.get(rp.user_id))
        .filter((player): player is RoomUserPreview => player !== undefined),
      roomPlayer: room_players.map((rp) => ({
        id: rp.id,
        user_id: rp.user_id,
        status: rp.status,
      })),
      owner: ownerProfile,
    };

    return { data: transformed, error };
  }
  
  return { data: null, error };
};

export const createRoom = async (
  roomData: CreateRoomInput,
  creator_id: string,
): Promise<{ id: string | null; error: PostgrestError | null }> => {
  const supabase = await createClient();

  // Call the Postgres function (RPC)
  const { data: id, error } = await supabase.rpc("create_room_with_player", {
    room_name: roomData.name,
    room_location: roomData.location,
    room_level: roomData.level,
    room_max_players: roomData.max_players,
    room_sport: roomData.sport,
    room_scheduled_date: roomData.scheduled_date,
    room_scheduled_time: roomData.scheduled_time,
    room_coins_reward: roomData.coins_reward,
    creator_id: creator_id,
  });
  return { id, error };
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
