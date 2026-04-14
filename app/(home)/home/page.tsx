import RoomsGrid from "@/components/rooms/RoomsGrid";
import { getRooms } from "@/services/roomService";
import "./page.css";
import { createClient } from "@/lib/supabase/server";
export default async function HomePage() {
  const { data, error, hasMore } = await getRooms(0, 10, ["All"]);
  const initialRooms = data ?? [];
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="main-layout">
      <div className="header-section">
        <div className="title">Available rooms</div>
      </div>
      <RoomsGrid
        initialRooms={initialRooms}
        initialHasMore={hasMore}
        currentUserId={user?.id ?? ""}
      />
    </div>
  );
}
