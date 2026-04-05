import { createClient } from "@/lib/supabase/server";
import { joinRoom, leaveRoom } from "@/services/roomService";
// Calls joinRoom
export async function POST(request: Request) {
    const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
      const body =await request.json()
      const {room_id}= body
      const {data,error} = await joinRoom(room_id)
            if(error) return  Response.json({ error }, { status: 500 });
      return Response.json({ data }, { status: 200 });
}
// Calls leaveRoom
export async function DELETE(request: Request) {
    const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
      const body =await request.json()
      const {room_id}= body
      const {data,error} = await leaveRoom(room_id)
            if(error) return  Response.json({ error }, { status: 500 });
      return Response.json({ data }, { status: 200 });
}