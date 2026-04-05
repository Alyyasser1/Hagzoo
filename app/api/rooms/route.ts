import { createClient } from "@/lib/supabase/server";
import { createRoom, getRooms } from "@/services/roomService";
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const offset = Number(searchParams.get("offset"));
  const limit = Number(searchParams.get("limit"));
  if (isNaN(offset) || isNaN(limit))
    return Response.json({ error: "Invalid params" }, { status: 400 });
  const { data, error, hasMore } = await getRooms(offset, limit);
  if (error) return Response.json({ error }, { status: 500 });
  return Response.json({ data, hasMore }, { status: 200 });
}
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const {
    name,
    location,
    level,
    max_players,
    sport,
    scheduled_date,
    scheduled_time,
    coins_reward,
  } = body;
  if (
    !name ||
    !location ||
    !level ||
    !max_players ||
    !sport ||
    !scheduled_date ||
    !scheduled_time ||
    !coins_reward
  )
    return Response.json({ error: "Data is not complete" }, { status: 400 });
  const { id, error } = await createRoom(body, user.id);
  if (error) return Response.json({ error }, { status: 500 });
  return Response.json({ id }, { status: 200 });
}
