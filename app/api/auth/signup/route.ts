import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { username, email, tel, birthDate, level, password } = body;

    // 1. Check username uniqueness in your own table
    const { data: existingUser,error:usernameCheckError} = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if(usernameCheckError) {
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

    // 2. Attempt signup
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
  console.error("signUp error:", error.message, error.status, error.code);
  return NextResponse.json({ error: error.message }, { status: 400 });
}

    // 3. Guard against null user entirely
    if (!data.user) {
      return NextResponse.json(
        { error: "Signup failed. Please try again." },
        { status: 400 }
      );
    }

    // 4. Supabase duplicate email detection:
    // When email already exists, Supabase returns a phantom user with
    // identities: [] instead of throwing an error.
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