import { createClient } from "@/lib/supabase/server";
import { getUserWithRooms } from "@/services/userService";
import { redirect } from "next/navigation";
import ProfileRoomsGrid from "@/components/profile/ProfileRoomsGrid";
import ProfileCard from "@/components/profile/ProfileCard";
import "./page.css";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const { data, error } = await getUserWithRooms(authUser.id);
  if (error || !data) {
    return <div className="error">Error loading profile.</div>;
  }

  return (
    <div className="profile-page">
      <ProfileCard data={data} />
      <hr className="room-divider" />

      <div className="rooms">
        <div className="rooms-section-title">Rooms</div>
        <ProfileRoomsGrid rooms={data.rooms} currentUserId={authUser.id} />
      </div>
    </div>
  );
}
