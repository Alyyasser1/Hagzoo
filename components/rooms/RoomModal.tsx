"use client";
import { RoomsWithPlayers, RoomWithOwner } from "@/types/data";
import { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import "./RoomModal.css";
import Image from "next/image";
import { getInitials } from "@/utils/userUtils";
import Button from "../ui/Button";
import { formatTime } from "@/utils/roomUtils";

interface RoomModalProps {
  room: RoomWithOwner;
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess?: (roomId: string) => void;
  currentUserId: string;
}

type PlayerDisplayStatus = "owner" | "accepted" | "pending";
type ActionMessageTone = "success" | "warning" | "danger";

type PlayerEntry = {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  level: RoomsWithPlayers["level"];
  status: PlayerDisplayStatus;
  roomPlayerId: string | null;
};

const getActionErrorMessage = (data: unknown, fallback: string): string => {
  if (typeof data === "object" && data !== null && "error" in data) {
    const error = (data as { error?: unknown }).error;
    if (typeof error === "string") return error;
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string"
    ) {
      return (error as { message: string }).message;
    }
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as { message?: unknown }).message === "string"
  ) {
    return (data as { message: string }).message;
  }

  return fallback;
};

const RoomModal = ({
  room,
  isOpen,
  onClose,
  onDeleteSuccess,
  currentUserId,
}: RoomModalProps) => {
  const [detailedRoom, setDetailedRoom] = useState<RoomsWithPlayers | null>(
    null,
  );
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionMessageTone, setActionMessageTone] =
    useState<ActionMessageTone>("warning");
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isOwner = room.created_by === currentUserId;

  const playerEntries = useMemo<PlayerEntry[]>(() => {
    if (!detailedRoom) return [];

    const entries = new Map<string, PlayerEntry>();
    const ownerId = detailedRoom.owner?.id ?? room.created_by;
    const ownerUsername =
      detailedRoom.owner?.username ?? room.users?.username ?? "Unknown user";
    const ownerEmail = detailedRoom.owner?.email ?? "";
    const ownerPhone = detailedRoom.owner?.phone ?? "";
    const ownerAvatarUrl =
      detailedRoom.owner?.avatar_url ?? room.users?.avatar_url ?? null;
    const ownerLevel = detailedRoom.owner?.level ?? room.level;

    entries.set(ownerId, {
      id: ownerId,
      username: ownerUsername,
      email: ownerEmail,
      phone: ownerPhone,
      avatar_url: ownerAvatarUrl,
      level: ownerLevel,
      status: "owner",
      roomPlayerId: null,
    });

    detailedRoom.users.forEach((player) => {
      const playerId = player?.id;
      if (!player || !playerId) return;
      if (playerId === room.created_by || entries.has(playerId)) return;

      const record = detailedRoom.roomPlayer.find(
        (rp) => rp.user_id === playerId,
      );

      entries.set(playerId, {
        ...player,
        status: (record?.status ?? "pending") as Exclude<
          PlayerDisplayStatus,
          "owner"
        >,
        roomPlayerId: record?.id ?? null,
      });
    });

    return Array.from(entries.values());
  }, [detailedRoom, room.created_by, room.level, room.users]);

  const currentUserRecord = detailedRoom?.roomPlayer?.find(
    (rp) => rp.user_id === currentUserId,
  );
  const isPlayer = currentUserRecord
    ? currentUserRecord.status !== "rejected"
    : false;

  const refetchRoom = useCallback(async () => {
    const res = await fetch(`/api/rooms/${room.id}`);
    const result = await res.json();
    setDetailedRoom(result.data);
  }, [room.id]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        await refetchRoom();
      } catch (err) {
        console.error("Failed to fetch room details", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [isOpen, refetchRoom]);

  useEffect(() => {
    if (!actionMessage) return;

    const timeoutId = setTimeout(() => {
      setActionMessage(null);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [actionMessage]);

  const handleJoin = async () => {
    setActionLoading("join");
    setActionMessage(null);
    try {
      const res = await fetch("/api/room_players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id: room.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        setActionMessage(
          getActionErrorMessage(data, "Failed to request to join"),
        );
        setActionMessageTone("danger");
        return;
      }

      await refetchRoom();
      setActionMessage("Request to join sent successfully!");
      setActionMessageTone("warning");
    } catch (err) {
      console.error("Failed to join room", err);
      setActionMessage("An error occurred");
      setActionMessageTone("danger");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeave = async () => {
    setActionLoading("leave");
    setActionMessage(null);
    try {
      const res = await fetch("/api/room_players", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id: room.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        setActionMessage(getActionErrorMessage(data, "Failed to leave room"));
        setActionMessageTone("danger");
        return;
      }

      setActionMessage("You left the room successfully!");
      setActionMessageTone("danger");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.error("Failed to leave room", err);
      setActionMessage("An error occurred");
      setActionMessageTone("danger");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    setActionLoading("delete");
    setActionMessage(null);
    try {
      const res = await fetch(`/api/rooms/${room.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        setActionMessage(getActionErrorMessage(data, "Failed to delete"));
        setActionMessageTone("danger");
        return;
      }

      if (data.message === "success") {
        setActionMessage("Room deleted successfully!");
        setActionMessageTone("danger");
        setTimeout(() => {
          onDeleteSuccess?.(room.id);
          onClose();
        }, 1500);
      } else {
        setActionMessage(data.message);
        setActionMessageTone("danger");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setActionMessage("An error occurred");
      setActionMessageTone("danger");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePlayerStatus = async (
    roomPlayerId: string,
    status: "accepted" | "rejected",
  ) => {
    setActionLoading(roomPlayerId);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/room_players/${roomPlayerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();

      if (!res.ok) {
        setActionMessage(
          getActionErrorMessage(data, "Failed to update player status"),
        );
        setActionMessageTone("danger");
        return;
      }

      await refetchRoom();
      setActionMessage(
        status === "accepted"
          ? "Player accepted successfully!"
          : "Player rejected successfully!",
      );
      setActionMessageTone(status === "accepted" ? "success" : "warning");
    } catch (err) {
      console.error("Failed to update player status", err);
      setActionMessage("An error occurred");
      setActionMessageTone("danger");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={room.name}>
      <div className="room-modal-content">
        <div className="room-details-grid">
          <div className="room-card-top">
            <div className="sport-tag">
              <div className="sport-icon">
                {room.sport === "football"
                  ? "⚽"
                  : room.sport === "tennis"
                    ? "🥎"
                    : room.sport === "padel"
                      ? "🎾"
                      : "⚽🥅"}
              </div>
              <div className="sport-name">{room.sport}</div>
            </div>
            <div className="status-container">
              <div
                className={`status-dot ${room.status === "open" ? "green" : "red"}`}
              ></div>
              <div className="status-text">{room.status}</div>
            </div>
          </div>
          <div className="room-card-meta">
            <div className="room-meta-row">📍 {room.location}</div>
            <div className="room-meta-row">
              {room.scheduled_date} - {formatTime(room.scheduled_time)}
            </div>
          </div>
          <div className="room-card-footer">
            <div className="player-fraction">
              {room.current_players} / {room.max_players}
            </div>
            <div
              className={`remaining-spots ${room.max_players - room.current_players === 0 ? "red" : room.max_players - room.current_players > 2 ? "green" : "yellow"}`}
            >
              {room.max_players - room.current_players} Spots left
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="room-modal-loading">Loading players...</div>
        ) : (
          <div className="players-grid">
            {playerEntries.map((player) => {
              const isPendingPlayer = player.status === "pending";
              const roomPlayerId = player.roomPlayerId;

              return (
                <div key={player.id} className="player-card">
                  <div className="player-card-main">
                    <div className="player-avatar">
                      {player.avatar_url ? (
                        <Image
                          src={player.avatar_url}
                          alt={player.username}
                          width={44}
                          height={44}
                          className="avatar-img"
                        />
                      ) : (
                        getInitials(player.username)
                      )}
                    </div>
                    <div className="player-info-text">
                      <div className="player-card-row player-card-header">
                        <div className="player-card-identity">
                          <div className="player-card-name">
                            {player.username}
                          </div>
                          <div className={`level-badge ${player.level}`}>
                            {player.level}
                          </div>
                        </div>
                        <div className={`player-status-badge ${player.status}`}>
                          {player.status}
                        </div>
                      </div>
                      <div className="player-card-row player-card-subinfo">
                        <div className="player-contact-group">
                          <div className="player-card-contact">
                            {player.phone || "No phone"}
                          </div>
                          <div className="player-card-contact">
                            {player.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isOwner &&
                    isPendingPlayer &&
                    player.id !== currentUserId &&
                    roomPlayerId && (
                      <div className="player-card-actions">
                        <Button
                          variant="accept"
                          size="sm"
                          isLoading={actionLoading === roomPlayerId}
                          onClick={() =>
                            handlePlayerStatus(roomPlayerId, "accepted")
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          isLoading={actionLoading === roomPlayerId}
                          onClick={() =>
                            handlePlayerStatus(roomPlayerId, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        )}{" "}
        <div className="room-modal-actions">
          {actionMessage && (
            <p
              style={{
                marginBottom: "8px",
                textAlign: "center",
                fontSize: "12px",
                color:
                  actionMessageTone === "success"
                    ? "var(--status-open)"
                    : actionMessageTone === "warning"
                      ? "var(--level-intermediate-text)"
                      : "var(--status-full)",
                borderColor:
                  actionMessageTone === "success"
                    ? "var(--status-open)"
                    : actionMessageTone === "warning"
                      ? "var(--level-intermediate-text)"
                      : "var(--status-full)",
              }}
            >
              {actionMessage}
            </p>
          )}
          {!isLoading && (
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
                <div>
                  <Button
                    variant="danger"
                    size="full"
                    isLoading={actionLoading === "delete"}
                    onClick={handleDelete}
                  >
                    Delete room
                  </Button>
                </div>
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
