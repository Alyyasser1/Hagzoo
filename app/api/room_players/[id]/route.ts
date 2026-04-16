import { createClient } from "@/lib/supabase/server";
import { updatePlayerStatus } from "@/services/userService";

// Calls updatePlayerStatus
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const { status } = body;
  if (!id)
    return Response.json({ error: "Missing player id" }, { status: 400 });
  if (status !== "accepted" && status !== "rejected")
    return Response.json(
      { error: "No valid fields to update" },
      { status: 400 },
    );
  const { data, error } = await updatePlayerStatus(id, status);
  if (error) return Response.json({ error }, { status: 500 });
  return Response.json({ data }, { status: 200 });
}
