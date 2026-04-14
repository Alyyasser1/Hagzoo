"use client";
import { RoomWithOwner } from "@/types/data";
import { useEffect, useRef, useState, useCallback } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import "../ui/Button.css";
import "../ui/Input.css";
import "./RoomsGrid.css";
import RoomCard from "./RoomCard";
import CreateRoomForm from "./CreateRoomForm";
import Modal from "./Modal";
interface RoomGridProps {
  initialRooms: RoomWithOwner[];
  initialHasMore: boolean;
}
const sportsList = ["All", "Football", "Padel", "Tennis", "Padbol"];
const RoomsGrid = ({ initialRooms, initialHasMore }: RoomGridProps) => {
  // States nedded
  const [rooms, setRooms] = useState<RoomWithOwner[]>(initialRooms);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [selectedSports, setSelectedSports] = useState<string[]>(["All"]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

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
  return (
    <div className="grid-page">
      <div className="filter-section">
        <div className="sport-filter">
          {sportsList.map((sport) => (
            <Button
              key={sport}
              variant={selectedSports.includes(sport) ? "primary" : "outline"}
              size="md"
              onClick={() => toggleSport(sport)}
            >
              {sport}
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
          <RoomCard key={room.id} room={room} />
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
    </div>
  );
};

export default RoomsGrid;
