import { RoomWithOwner } from "@/types/data";
import "./RoomCard.css";
import Image from "next/image";
import { getInitials } from "@/utils/userUtils";
import { formatTime } from "@/utils/roomUtils";

interface RoomCardProps {
  room: RoomWithOwner;
}
const RoomCard = ({ room }: RoomCardProps) => {
  return (
    <div className="room-card">
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
        <div
          className={`status-dot ${room.status === "open" ? "green" : "red"}`}
        ></div>
      </div>
      <div className="room-name">{room.name}</div>
      <div className="room-meta">
        <div className="room-meta-row">📍 {room.location}</div>
        <div className="room-meta-row">
          {room.scheduled_date}—{formatTime(room.scheduled_time)}
        </div>
      </div>
      <hr className="room-divider"></hr>
      <div className="room-footer">
        <div className="owner">
          <div className="owner-avatar">
            {room.users.avatar_url ? (
              <Image
                src={room.users.avatar_url}
                alt={room.users.username}
                width={24}
                height={24}
                className="avatar-img"
              ></Image>
            ) : (
              <div className="avatar-initials">
                {getInitials(room.users.username)}
              </div>
            )}
          </div>
          <div className="owner-name">{room.users.username}</div>
        </div>
        <div className="room-right">
          <div className="players-count">
            {room.current_players}/{room.max_players}
          </div>
          <div className={`level-badge ${room.level}`}>{room.level}</div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
