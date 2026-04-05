import { createClient } from "@/lib/supabase/server";
import { getUserRooms } from "@/services/userService";
// calls getUserRooms
export async function GET(request: Request) {
    const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
      const id = user.id
      const {data,error} =await getUserRooms(id)
      if(error) return  Response.json({ error }, { status: 500 });
      return Response.json({ data }, { status: 200 });
    }