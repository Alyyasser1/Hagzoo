"use server";
import { User } from "../types/data";
import { createClient } from "../lib/supabase/sever";
export const getUserById = async (
  id: string,
): Promise<{ data: User | null; error: Error | null }> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("id", id)
    .single<User>();
  return { data, error };
};
export const updateUserInfo = async (
  id: string,
  updates: Partial<User>,
): Promise<{ data: User | null; error: Error | null }> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("User")
    .update(updates)
    .eq("id", id)
    .select()
    .single<User>();
  return { data, error };
};
