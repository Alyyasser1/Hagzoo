import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";
import { completeRoom, deleteRoom, getRoomById } from "@/services/roomService";
// Calls getRoomById
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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
// Calls deletRoom
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;  // ✅ Get ID from URL path params
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (!id) {
    return Response.json({ error: "room_id is required" }, { status: 400 });
  }

const {data: deleteResult, error } = await deleteRoom(id);
if (error) {
  console.error("Delete room RPC error:", error);
  return Response.json({ error: error.message || "Failed to delete room" }, { status: 500 });
}

if (deleteResult !== "success") {
  console.error("Delete failed with message:", deleteResult);
  return Response.json({ message: deleteResult }, { status: 400 });
}

return Response.json({ message: deleteResult }, { status: 200 });
}
// Calls completeRoom
export async function PATCH(request: NextRequest,{ params }: { params: Promise<{id: string }> },) {
    const supabase = await createClient();
    const{id} = await params
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
      if(!id) return Response.json({error:"room_id is required"},{status:400})
      const { data, error } = await completeRoom(id);
if (error) return Response.json({ error: error.message }, { status: 500 });
if(!data) return Response.json({ error: "No response from server." }, { status: 500 })
if (data !== "success") {
  const messages: Record<string, string> = {
    room_not_found: "Room not found.",
    not_owner: "You are not the owner of this room.",
    already_completed: "Room is already completed.",
    game_not_started: "The game hasn't started yet.",
    not_enough_players: "Not enough accepted players to complete the room.",
  };
  return Response.json(
    { error: messages[data] ?? data },
    { status: 400 }
  );
}

return Response.json({ data }, { status: 200 });
}
