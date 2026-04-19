"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/utils/userUtils";
import "./AvatarUpload.css";

interface AvatarUploadProps {
  userId: string;
  username: string;
  avatarUrl: string | null;
  onUploadSuccess: (url: string) => void; // New prop
}

export default function AvatarUpload({
  userId,
  username,
  avatarUrl,
  onUploadSuccess,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      onUploadSuccess(urlData.publicUrl);
    } catch (err: unknown) {
      // Change any to unknown
      const message = err instanceof Error ? err.message : "Upload failed.";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="avatar-upload">
      <div
        className="avatar-upload-trigger"
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={username}
            width={80}
            height={80}
            className="avatar-upload-img"
          />
        ) : (
          <div className="avatar-upload-initials">{getInitials(username)}</div>
        )}
        <div className="avatar-upload-overlay">
          {uploading ? (
            <span className="avatar-upload-spinner" />
          ) : (
            <svg
              className="avatar-upload-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="avatar-upload-input"
        onChange={handleFileChange}
      />

      {error && <p className="avatar-upload-error">{error}</p>}
    </div>
  );
}
