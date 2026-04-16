import { createClient } from "@/lib/supabase/server";
import { createRoom, getRooms } from "@/services/roomService";
// Calls getRooms
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const offset = Number(searchParams.get("offset"));
  const limit = Number(searchParams.get("limit"));
  const sport: string[] = searchParams.get("sport")?.split(",") ?? []
  const search = searchParams.get("name") ?? "";
  if (isNaN(offset) || isNaN(limit))
    return Response.json({ error: "Invalid params" }, { status: 400 });
  const { data, error, hasMore } = await getRooms(offset, limit,sport,search);
  if (error) return Response.json({ error }, { status: 500 });
  return Response.json({ data, hasMore }, { status: 200 });
}
// Calls createRoom
export async function POST(request: Request) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    name,
    location,
    level,
    max_players,
    sport,
    scheduled_date,
    scheduled_time,
  } = body;

  const CONSTANT_REWARD = 50;

  // Validate that all required frontend fields are present
  if (
    !name ||
    !location ||
    !level ||
    !max_players ||
    !sport ||
    !scheduled_date ||
    !scheduled_time
  ) {
    return Response.json({ error: "Data is not complete" }, { status: 400 });
  }

  // Combine the body with the constant reward to satisfy CreateRoomInput
  const roomData = { ...body, coins_reward: CONSTANT_REWARD };

  const { id, error } = await createRoom(roomData, user.id);

  if (error) {
    console.error("Supabase RPC Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ id }, { status: 200 });
}
