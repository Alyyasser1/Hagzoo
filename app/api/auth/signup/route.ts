import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Service role client - bypasses RLS
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    
    const body = await request.json();
    const { username, email, tel, birthDate, level, password } = body;

    // 1. Check username uniqueness 
    const { data: existingUser, error: usernameCheckError } = await adminSupabase
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (usernameCheckError) {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists. Try a different one." },
        { status: 400 }
      );
    }

    // 2. Attempt signup with regular client
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/home`,
        data: {
          username,
          phone: tel,
          birth_date: birthDate,
          level,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Signup failed. Please try again." },
        { status: 400 }
      );
    }

    if (data.user.identities?.length === 0) {
      return NextResponse.json(
        { error: "An account with this email already exists. Try logging in." },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Signup successful" }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}