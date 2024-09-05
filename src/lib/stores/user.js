import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';

export const user = writable(null);

export async function getUser() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    throw new Error("Error getting user details: " + error);
  }
}

// Listen for changes in authentication state
supabase.auth.onAuthStateChange((event, session) => {
  user.set(session?.user || null);
});
