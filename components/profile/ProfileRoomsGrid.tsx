"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = useState<RoomWithOwner | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  useEffect(() => {
    if (!actionMessage) return;
    const timeout = setTimeout(() => setActionMessage(null), 2000);
    return () => clearTimeout(timeout);
  }, [actionMessage]);
  const handleCompleteRoom = async (roomId: string) => {
    setActionLoading(roomId);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/rooms/${roomId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });

      const data = await res.json();

      if (!res.ok) {
        setActionMessage({
          text: data?.error ?? "Failed to complete room.",
          type: "error",
        });
        return;
      }

      setActionMessage({ text: "Room marked as completed!", type: "success" });
      router.refresh();
    } catch (err) {
      console.error("Complete failed:", err);
      setActionMessage({ text: "An error occurred.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  if (rooms.length === 0) {
    return (
      <div className="profile-rooms-empty">
        <p>No rooms Available.</p>
      </div>
    );
  }

  return (
    <>
      {actionMessage && (
        <p
          className="profile-rooms-message"
          style={{
            color:
              actionMessage.type === "success"
                ? "var(--status-open)"
                : "var(--status-full)",
            textAlign: "center",
            fontSize: "13px",
            marginBottom: "12px",
          }}
        >
          {actionMessage.text}
        </p>
      )}

      <div className="profile-rooms-grid">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            isOwner={room.created_by === currentUserId}
            onClick={(r) => setSelectedRoom(r)}
            onComplete={
              actionLoading === room.id ? undefined : handleCompleteRoom
            }
          />
        ))}
      </div>

      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          currentUserId={currentUserId}
          onClose={() => setSelectedRoom(null)}
          isOpen={selectedRoom.status === "open"}
        />
      )}
    </>
  );
}
