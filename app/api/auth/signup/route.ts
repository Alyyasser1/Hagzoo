import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { username,email,tel,birthDate,level, password } = body;
    const { data,error } = await supabase.auth.signUp({email,password,options:{
        data:{
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/home`,
            username,
            phone:tel,
            birth_date:birthDate,
            level,
        }
    }});
    if (error) {
      console.error("signup error:", error.message);
      return NextResponse.json(
        { error: error.message }, 
        { status: 400 }
      ); 
    }
    if (data.user && data.user.identities && data.user.identities.length === 0) {
  return NextResponse.json(
    { error: "Account already exists. Try to login." },
    { status: 400 }
  );
  }
    return NextResponse.json({ message: "signup successful" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}