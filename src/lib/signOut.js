import { supabase } from '$lib/supabaseClient';
import { goto } from '$app/navigation';

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error('Error signing out:', error);
    console.log('Successfully signed out');
    goto("/");
  } catch (err) {
    console.error(err);
  }
}
