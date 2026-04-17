"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserWithRooms } from "@/types/data";
import AvatarUpload from "./AvatarUpload";
import Button from "../ui/Button";
import "./ProfileCard.css";

export default function ProfileCard({ data }: { data: UserWithRooms }) {
  const router = useRouter();

  // State for changes
  const [avatarUrl, setAvatarUrl] = useState<string | null>(data.avatar_url);
  const [bio, setBio] = useState<string>(data.bio || "");

  // UI state
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // One check to rule them all: Are there unsaved changes?
  const hasChanges = avatarUrl !== data.avatar_url || bio !== (data.bio || "");

  const handleSaveAll = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: avatarUrl, bio }),
      });

      if (!res.ok) throw new Error("Failed to save profile updates.");

      router.refresh();
      setIsEditingBio(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Save failed.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Revert everything to the original data from props
    setBio(data.bio || "");
    setAvatarUrl(data.avatar_url);
    setIsEditingBio(false);
    setError(null);
  };

  return (
    <div className="profile-hero">
      <div className="profile-top">
        <AvatarUpload
          userId={data.id}
          username={data.username}
          avatarUrl={avatarUrl}
          onUploadSuccess={(newUrl) => setAvatarUrl(newUrl)}
        />
        <div className="player-info" style={{ flex: 1 }}>
          <div className="profile-name-level">
            <div className="profile-name">{data.username}</div>
            <div className={`level-badge ${data.level}`}>{data.level}</div>
          </div>
          <div className="profile-sub" style={{ marginBottom: "8px" }}>
            {data.email}
          </div>

          <div className="profile-bio-section">
            {isEditingBio ? (
              /* --- EDIT MODE --- */
              <div className="bio-edit-group">
                <textarea
                  className="profile-bio-input"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a short bio..."
                  rows={2}
                  autoFocus
                />
                <div className="bio-inline-actions">
                  <Button
                    variant="accept"
                    size="sm"
                    onClick={handleSaveAll}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              /* --- DISPLAY MODE --- */
              <div className="bio-display-group">
                <p className="profile-bio-text">{bio || "No bio added yet."}</p>

                {/* If we have pending changes (like a new avatar), show the 
                  Save/Cancel pair right here. Otherwise, show the edit icon.
                */}
                {hasChanges ? (
                  <div className="bio-inline-actions">
                    <Button
                      variant="accept"
                      size="md"
                      onClick={handleSaveAll}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="danger"
                      size="md"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <button
                    className="bio-edit-icon"
                    onClick={() => setIsEditingBio(true)}
                    title="Edit Bio"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                )}
              </div>
            )}
            {error && <div className="avatar-upload-error">{error}</div>}
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <div className="profile-stat-value">{data.total_coins_earned}</div>
          <div className="profile-stat-label">Coins earned</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat-value">{data.total_games_played}</div>
          <div className="profile-stat-label">Games played</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat-value">{data.rooms.length}</div>
          <div className="profile-stat-label">Rooms created</div>
        </div>
      </div>
    </div>
  );
}
