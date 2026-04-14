"use client";
import { RoomsWithPlayers, RoomWithOwner } from "@/types/data";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import "./RoomModal.css";
import Image from "next/image";
import { getInitials } from "@/utils/userUtils";
import Button from "../ui/Button";

interface RoomModalProps {
  room: RoomWithOwner;
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

const RoomModal = ({
  room,
  isOpen,
  onClose,
  currentUserId,
}: RoomModalProps) => {
  const [detailedRoom, setDetailedRoom] = useState<RoomsWithPlayers | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isOwner = detailedRoom
    ? detailedRoom.created_by === currentUserId
    : room.created_by === currentUserId;

  // Check if current user is in the players list
  const isPlayer =
    detailedRoom?.users?.some((p) => p.id === currentUserId) ?? false;

  useEffect(() => {
    if (!isOpen) return;
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/rooms/${room.id}`);
        const result = await res.json();
        setDetailedRoom(result.data);
      } catch (err) {
        console.error("Failed to fetch room details", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [isOpen, room.id]);

  const handleJoin = async () => {
    setActionLoading("join");
    try {
      await fetch("/api/room-players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id: room.id }),
      });
      const res = await fetch(`/api/rooms/${room.id}`);
      const result = await res.json();
      setDetailedRoom(result.data);
    } catch (err) {
      console.error("Failed to join room", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeave = async () => {
    setActionLoading("leave");
    try {
      await fetch("/api/room-players", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id: room.id }),
      });
      onClose();
    } catch (err) {
      console.error("Failed to leave room", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    setActionLoading("delete");
    try {
      await fetch(`/api/rooms/${room.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id: room.id }),
      });
      onClose();
    } catch (err) {
      console.error("Failed to delete room", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePlayerStatus = async (
    playerId: string,
    status: "accepted" | "rejected",
  ) => {
    setActionLoading(playerId);
    try {
      await fetch(`/api/room-players/${playerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const res = await fetch(`/api/rooms/${room.id}`);
      const result = await res.json();
      setDetailedRoom(result.data);
    } catch (err) {
      console.error("Failed to update player status", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={room.name}>
      <div className="room-modal-content">
        <div className="room-modal-info">
          <div className="room-modal-info-row">📍 {room.location}</div>
          <div className="room-modal-info-row">🏅 {room.sport}</div>
          <div className="room-modal-info-row">
            📅 {room.scheduled_date} — {room.scheduled_time}
          </div>
          <div className="room-modal-info-row">👑 {room.users.username}</div>
          <div className="room-modal-info-row">
            👥 {room.current_players}/{room.max_players} players
          </div>
        </div>

        <hr className="room-modal-divider" />

        <div className="room-modal-players">
          <div className="room-modal-players-title">Players</div>
          {isLoading ? (
            <div className="room-modal-loading">Loading players...</div>
          ) : (
            (detailedRoom?.users ?? []).map((player) => {
              // OPTION 2: Robust lookup of status via user_id
              const matchingRecord = detailedRoom?.roomPlayer?.find(
                (rp) => rp.user_id === player.id,
              );
              const playerStatus = matchingRecord?.status || "pending";

              return (
                <div key={player.id} className="player-row">
                  <div className="player-info">
                    <div className="player-avatar">
                      {player.avatar_url ? (
                        <Image
                          src={player.avatar_url}
                          alt={player.username}
                          width={32}
                          height={32}
                          className="avatar-img"
                        />
                      ) : (
                        getInitials(player.username)
                      )}
                    </div>
                    <div className="player-details">
                      <div className="player-name">{player.username}</div>
                      <div className="player-level">{player.level}</div>
                    </div>
                  </div>
                  <div className="player-right">
                    <div className={`player-status ${playerStatus}`}>
                      {playerStatus}
                    </div>
                    {isOwner &&
                      playerStatus === "pending" &&
                      player.id !== currentUserId && (
                        <div className="player-actions">
                          <Button
                            variant="primary"
                            size="sm"
                            isLoading={actionLoading === player.id}
                            onClick={() =>
                              handlePlayerStatus(player.id, "accepted")
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            isLoading={actionLoading === player.id}
                            onClick={() =>
                              handlePlayerStatus(player.id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <hr className="room-modal-divider" />

        <div className="room-modal-actions">
          {isLoading ? (
            <Button variant="outline" size="full" disabled>
              Loading options...
            </Button>
          ) : (
            <>
              {!isPlayer && !isOwner && (
                <Button
                  variant="primary"
                  size="full"
                  isLoading={actionLoading === "join"}
                  onClick={handleJoin}
                >
                  Request to join
                </Button>
              )}

              {isOwner && (
                <Button
                  variant="danger"
                  size="full"
                  isLoading={actionLoading === "delete"}
                  onClick={handleDelete}
                >
                  Delete room
                </Button>
              )}

              {isPlayer && !isOwner && (
                <Button
                  variant="danger"
                  size="full"
                  isLoading={actionLoading === "leave"}
                  onClick={handleLeave}
                >
                  Leave room
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RoomModal;
