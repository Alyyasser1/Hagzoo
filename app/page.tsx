import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import "./page.css";
import AuthCard from "@/components/auth/AuthCard";
import { Suspense } from "react";
import AuthContainer from "@/components/auth/AutheContainer";
export default async function Landing() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/home");
  return (
    <div className="landing-page">
      <div className="landing-logo-mark">
        <div className="landing-H">H</div>
        <div className="landing-dot1"></div>
        <div className="landing-dot2"></div>
      </div>
      <div className="landing-name">Hagzoo</div>
      <div className="landing-tagline">
        Find players. Join games. Earn rewards.
      </div>
      <AuthCard>
        <Suspense fallback={null}>
          <AuthContainer></AuthContainer>
        </Suspense>
      </AuthCard>
    </div>
  );
}
