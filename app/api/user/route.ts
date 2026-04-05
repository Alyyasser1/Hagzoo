import { createClient } from "@/lib/supabase/server";
import {
  getUserById,
  updatePlayerStatus,
  updateUserInfo,
} from "@/services/userService";
// Calls getUserById
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const id = user.id;
  const { data, error } = await getUserById(id);
  if (error) return Response.json({ error }, { status: 500 });
  return Response.json({ data }, { status: 200 });
}
// Calls updateUserInfo
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const {
    id,
    coins,
    created_at,
    total_games_played,
    total_coins_earned,
    ...safeUpdates
  } = body;
  if (Object.keys(safeUpdates).length === 0)
    return Response.json(
      { error: "No valid fields to update" },
      { status: 400 },
    );
  const { data, error } = await updateUserInfo(user.id, safeUpdates);
  if (error) return Response.json({ error }, { status: 500 });
  return Response.json({ data }, { status: 200 });
}

