"use client";
import { RoomWithOwner } from "@/types/data";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Input from "../ui/Input";
import "../ui/Button.css";
import "../ui/Input.css";
import "./RoomsGrid.css";
import RoomCard from "./RoomCard";
import CreateRoomForm from "./CreateRoomForm";
import Modal from "./Modal";
import RoomModal from "./RoomModal";
import { createClient } from "@/lib/supabase/client";
interface RoomGridProps {
  initialRooms: RoomWithOwner[];
  initialHasMore: boolean;
  currentUserId: string;
}
const sportsList = [
  { label: "All", value: "All" },
  { label: "Football", value: "football" },
  { label: "Padel", value: "padel" },
  { label: "Tennis", value: "tennis" },
  { label: "Padbol", value: "padbol" },
];
const RoomsGrid = ({
  initialRooms,
  initialHasMore,
  currentUserId,
}: RoomGridProps) => {
  const router = useRouter();
  // States nedded
  const [rooms, setRooms] = useState<RoomWithOwner[]>(initialRooms);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [selectedSports, setSelectedSports] = useState<string[]>(["All"]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomWithOwner | null>(null);
  const isFirstRender = useRef(true);

  // Wrap fetchRooms in useCallback
  const fetchRooms = useCallback(
    async (isNewFilter: boolean, manualOffset?: number) => {
      setIsLoading(true);

      const offset = isNewFilter ? 0 : (manualOffset ?? 0);
      const sportParam = selectedSports.join(",");

      try {
        const response = await fetch(
          `/api/rooms?offset=${offset}&limit=10&sport=${sportParam}&name=${search}`,
        );
        const result = await response.json();

        if (isNewFilter) {
          setRooms(result.data || []);
        } else {
          setRooms((prev) => [...prev, ...(result.data || [])]);
        }
        setHasMore(result.hasMore);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedSports, search],
  );
  // reacts to DB changes, patches local state directly
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("room-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
        },
        (payload) => {
          const updated = payload.new as Partial<RoomWithOwner>;
          setRooms((prev) =>
            prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)),
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "rooms",
        },
        (payload) => {
          setRooms((prev) => prev.filter((r) => r.id !== payload.old.id));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // reacts to user input changes, fires fetch calls
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchRooms(true);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedSports, fetchRooms]);

  const toggleSport = (sport: string) => {
    setSelectedSports((prev) => {
      // If "All" is clicked, reset everything
      if (sport === "All") return ["All"];

      // Remove "All" and toggle the clicked sport
      const withoutAll = prev.filter((s) => s !== "All");
      const isAlreadySelected = withoutAll.includes(sport);

      const next = isAlreadySelected
        ? withoutAll.filter((s) => s !== sport) // Remove if there
        : [...withoutAll, sport]; // Add if not there

      // If everything is unchecked, go back to ["All"]
      return next.length === 0 ? ["All"] : next;
    });
  };

  const handleRoomDeleted = useCallback(
    (deletedRoomId: string) => {
      setRooms((prev) => prev.filter((room) => room.id !== deletedRoomId));
      setSelectedRoom(null);
      router.refresh();
    },
    [router],
  );

  return (
    <div className="grid-page">
      <div className="filter-section">
        <div className="sport-filter">
          {sportsList.map((sport) => (
            <Button
              key={sport.value}
              variant={
                selectedSports.includes(sport.value) ? "primary" : "outline"
              }
              size="md"
              onClick={() => toggleSport(sport.value)}
            >
              {sport.label}
            </Button>
          ))}
        </div>
        <div className="search-filter">
          <Input
            id="search"
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="grid">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onClick={(clickedRoom) => setSelectedRoom(clickedRoom)}
          />
        ))}
      </div>
      {hasMore && (
        <Button
          variant="outline"
          size="full"
          isLoading={isLoading}
          onClick={() => fetchRooms(false)}
        >
          Load more rooms
        </Button>
      )}
      <div className="floating-action">
        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsCreateRoomModalOpen(true)}
        >
          + Create room
        </Button>
      </div>
      {isCreateRoomModalOpen && (
        <Modal
          title="Create Room"
          isOpen={isCreateRoomModalOpen}
          onClose={() => setIsCreateRoomModalOpen(false)}
        >
          <CreateRoomForm
            onSuccess={() => {
              setIsCreateRoomModalOpen(false);
              fetchRooms(true);
            }}
          ></CreateRoomForm>
        </Modal>
      )}
      {selectedRoom && (
        <RoomModal
          currentUserId={currentUserId}
          room={selectedRoom}
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onDeleteSuccess={handleRoomDeleted}
        />
      )}
    </div>
  );
};

export default RoomsGrid;
