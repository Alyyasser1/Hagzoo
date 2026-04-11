import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";
import { getUserById } from "@/services/userService";
import { redirect } from "next/navigation";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const { data: userData } = await getUserById(user.id);
  if (!userData) redirect("/");
  return (
    <>
      <Navbar user={userData} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
