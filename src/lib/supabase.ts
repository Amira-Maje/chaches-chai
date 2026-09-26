import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_URL || process.env?.SUPABASE_URL)) ||
  '';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY)) ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-supabase-anon-key')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Helper functions for Supabase CRUD
export async function syncOrderToSupabase(orderData: any) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('orders').insert([orderData]).select().single();
    if (error) {
      console.warn('Supabase order insert warning:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase sync error:', err);
    return null;
  }
}

export async function syncBookingToSupabase(bookingData: any) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('bookings').insert([bookingData]).select().single();
    if (error) {
      console.warn('Supabase booking insert warning:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase sync error:', err);
    return null;
  }
}

export async function syncReviewToSupabase(reviewData: any) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('reviews').insert([reviewData]).select().single();
    if (error) {
      console.warn('Supabase review insert warning:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase sync error:', err);
    return null;
  }
}
