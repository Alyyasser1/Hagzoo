import { createClient } from "@/lib/supabase/server";
import { getRoomById } from "@/services/roomService";
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!id) return Response.json({ error: "Invalid room ID" }, { status: 400 });
  const { data, error } = await getRoomById(id);
  if (error) return Response.json({ error }, { status: 500 });
  return Response.json({ data }, { status: 200 });
}
