"use client";
import "./Navbar.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "@/types/data";
import Button from "../ui/Button";
import { getInitials } from "@/utils/userUtils";
interface NavbarProps {
  user: User;
}
const Navbar = ({ user }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".avatar")) {
        setIsOpen(false);
      }
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
        <div className="avatar" onClick={() => setIsOpen(!isOpen)}>
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.username}
              className="avatar-img"
            />
          ) : (
            <span>{getInitials(user.username)}</span>
          )}
          <div className={`avatar-popup ${isOpen ? "active" : ""}`}>
            <div className="popup-header">
              <div className="popup-avatar">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.username}
                    className="avatar-img"
                  />
                ) : (
                  <span>{getInitials(user.username)}</span>
                )}
              </div>
              <div>
                <div className="popup-name">{user.username}</div>
                <div className="popup-level">{user.level}</div>
              </div>
            </div>
            <div className="popup-stats">
              <div className="popup-stat">
                <div className="popup-stat-value">{user.coins}</div>
                <div className="popup-stat-label">Coins</div>
              </div>
              <div className="popup-stat">
                <div className="popup-stat-value">
                  {user.total_games_played}
                </div>
                <div className="popup-stat-label">Games</div>
              </div>
            </div>
            <Button id="logout" variant="danger" size="full">
              Log out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
