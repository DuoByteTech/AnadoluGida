import { supabase } from "../../../lib/supabase/client";

export const signUpWithEmail = async ({
  email,
  password,
  firstName,
  lastName,
}) => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        first_name: firstName?.trim() || "",
        last_name: lastName?.trim() || "",
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
};

export const getProfileByUserId = async (userId) => {
  if (!userId) {
    throw new Error("USER_ID_REQUIRED");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
        id,
        email,
        first_name,
        last_name,
        role,
        is_active,
        created_at,
        updated_at
      `,
    )
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
};
