"use client";

import { useState } from "react";
import RoomCard from "@/components/rooms/RoomCard";
import RoomModal from "@/components/rooms/RoomModal";
import { RoomWithOwner } from "@/types/data";

interface ProfileRoomsGridProps {
  rooms: RoomWithOwner[];
  currentUserId: string;
}

export default function ProfileRoomsGrid({
  rooms,
  currentUserId,
}: ProfileRoomsGridProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomWithOwner | null>(null);

  if (rooms.length === 0) {
    return (
      <div className="profile-rooms-empty">
        <p>No rooms yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="profile-rooms-grid">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onClick={() => setSelectedRoom(room)}
          />
        ))}
      </div>

      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          currentUserId={currentUserId}
          onClose={() => setSelectedRoom(null)}
          isOpen={selectedRoom.status === "open" ? true : false}
        />
      )}
    </>
  );
}
