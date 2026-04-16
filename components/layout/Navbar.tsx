"use client";
import "./Navbar.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "@/types/data";
import Button from "../ui/Button";
import { getInitials, logout } from "@/utils/userUtils";

interface NavbarProps {
  user: User | null; // Changed to allow null to prevent crashes
}

const Navbar = ({ user }: NavbarProps) => {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isRewardOpen, setIsRewardOpen] = useState(false);
  const router = useRouter();
  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push("/profile");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest(".avatar")) setIsAvatarOpen(false);
      if (!target.closest(".rewards-menu")) setIsRewardOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      <div className="log-wrap">
        <div className="logo-mark">
          <div className="logo-H">H</div>
          <div className="logo-dot1"></div>
          <div className="logo-dot2"></div>
        </div>
        <div className="logo-text">Hagzoo</div>
      </div>

      <div className="nav-right">
        <div className="rewards-menu">
          <button
            className="nav-icon-button"
            onClick={() => setIsRewardOpen(!isRewardOpen)}
          >
            {/* Direct SVG for better reliability */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 12 20 22 4 22 4 12"></polyline>
              <rect x="2" y="7" width="20" height="5"></rect>
              <line x1="12" y1="22" x2="12" y2="7"></line>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
          </button>

          <div className={`nav-popup ${isRewardOpen ? "active" : ""}`}>
            <div className="popup-placeholder">Rewards are coming soon!</div>
          </div>
        </div>

        <div className="avatar" onClick={() => setIsAvatarOpen(!isAvatarOpen)}>
          {user?.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.username || "User"}
              width={24}
              height={24}
              className="avatar-img"
            />
          ) : (
            <span>{getInitials(user?.username || "Guest")}</span>
          )}

          {/* Avatar Popup */}
          <div className={`avatar-popup ${isAvatarOpen ? "active" : ""}`}>
            <div className="popup-header">
              <div className="popup-avatar">
                {user?.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt="User"
                    width={24}
                    height={24}
                    className="avatar-img"
                  />
                ) : (
                  <span>{getInitials(user?.username || "??")}</span>
                )}
              </div>
              <div>
                <div className="popup-name" onClick={goToProfile}>
                  {user?.username || "Unknown User"}
                </div>
                <div className="popup-level">{user?.level || "Level 1"}</div>
              </div>
            </div>
            <div className="popup-stats">
              <div className="popup-stat">
                <div className="popup-stat-value">{user?.coins || 0}</div>
                <div className="popup-stat-label">Coins</div>
              </div>
              <div className="popup-stat">
                <div className="popup-stat-value">
                  {user?.total_games_played || 0}
                </div>
                <div className="popup-stat-label">Games</div>
              </div>
            </div>
            <Button
              id="logout"
              variant="danger"
              size="full"
              onClick={() => logout(router)}
            >
              Log out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
