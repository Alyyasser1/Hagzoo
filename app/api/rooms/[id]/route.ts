import { createClient } from "@/lib/supabase/server";
import { completeRoom, deleteRoom, getRoomById } from "@/services/roomService";
// Calls getRoomById
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
// Calls deletRoom
export async function DELETE(request: Request) {
    const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
      const body =await request.json()
      const {room_id}= body
      if(!room_id) return Response.json({error:"room_id is required"},{status:400})
      const {data,error} = await deleteRoom(room_id)
            if(error) return  Response.json({ error }, { status: 500 });
      return Response.json({ data }, { status: 200 });
}
// Calls completeRoom
export async function PATCH(request: Request,{ params }: { params: {id: string } },) {
    const supabase = await createClient();
    const{id} = params
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
      if(!id) return Response.json({error:"room_id is required"},{status:400})
      const {data,error} = await completeRoom(id)
            if(error) return  Response.json({ error }, { status: 500 });
      return Response.json({ data }, { status: 200 });
}
