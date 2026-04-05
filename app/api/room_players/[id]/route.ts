import { createClient } from "@/lib/supabase/server";
import { updatePlayerStatus } from "@/services/userService";

// Calls updatePlayerStatus
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { id, status } = body;
  if (Object.keys(status).length === 0)
    return Response.json(
      { error: "No valid fields to update" },
      { status: 400 },
    );
  const { data, error } = await updatePlayerStatus(id, status);
  if (error) return Response.json({ error }, { status: 500 });
  return Response.json({ data }, { status: 200 });
}
