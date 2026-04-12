import RoomsGrid from "@/components/rooms/RoomsGrid";
import { getRooms } from "@/services/roomService";
export default async function HomePage() {
  const { data, error, hasMore } = await getRooms(0, 10, ["All"]);
  const initialRooms = data ?? [];
  return (
    <div className="main">
      <div className="header-section">
        <div className="title">Available rooms</div>
      </div>
      <RoomsGrid
        initialRooms={initialRooms}
        initialHasMore={hasMore}
      ></RoomsGrid>
    </div>
  );
}
