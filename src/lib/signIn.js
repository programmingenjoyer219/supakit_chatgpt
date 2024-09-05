import { supabase } from '$lib/supabaseClient';

export async function signInWithGoogle() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw new Error('Error signing in with Google:', error);
    console.log('Successfully signed in with Google');
  } catch (err) {
    console.error(err);
  }
}
