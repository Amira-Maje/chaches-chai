import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuration resolver checking localStorage first, then environment
export function getActiveSupabaseConfig(): { url: string; anonKey: string; isCustom: boolean } {
  let url = '';
  let anonKey = '';
  let isCustom = false;

  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem('VITE_SUPABASE_URL') || localStorage.getItem('supabase_url');
    const localKey = localStorage.getItem('VITE_SUPABASE_ANON_KEY') || localStorage.getItem('supabase_anon_key');
    if (localUrl && localKey) {
      url = localUrl.trim();
      anonKey = localKey.trim();
      isCustom = true;
    }
  }

  if (!url) {
    url =
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
      (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_URL || process.env?.SUPABASE_URL)) ||
      '';
  }

  if (!anonKey) {
    anonKey =
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
      (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY)) ||
      '';
  }

  return { url, anonKey, isCustom };
}

let activeClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getActiveSupabaseConfig();
  const isValid =
    url &&
    anonKey &&
    !url.includes('your-project-id') &&
    !anonKey.includes('your-supabase-anon-key');

  if (!isValid) return null;

  if (!activeClient) {
    activeClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return activeClient;
}

export function isSupabaseReady(): boolean {
  const { url, anonKey } = getActiveSupabaseConfig();
  return Boolean(
    url &&
    anonKey &&
    !url.includes('your-project-id') &&
    !anonKey.includes('your-supabase-anon-key')
  );
}

export function saveSupabaseCredentials(url: string, anonKey: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const cleanUrl = url.trim();
    const cleanKey = anonKey.trim();
    localStorage.setItem('VITE_SUPABASE_URL', cleanUrl);
    localStorage.setItem('VITE_SUPABASE_ANON_KEY', cleanKey);
    localStorage.setItem('supabase_url', cleanUrl);
    localStorage.setItem('supabase_anon_key', cleanKey);
    activeClient = createClient(cleanUrl, cleanKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
    return true;
  } catch (e) {
    console.error('Failed to save Supabase credentials:', e);
    return false;
  }
}

export function clearSupabaseCredentials(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('VITE_SUPABASE_URL');
  localStorage.removeItem('VITE_SUPABASE_ANON_KEY');
  localStorage.removeItem('supabase_url');
  localStorage.removeItem('supabase_anon_key');
  activeClient = null;
}

export async function testSupabaseConnection(overrideUrl?: string, overrideKey?: string): Promise<{ success: boolean; message: string }> {
  try {
    let clientToTest: SupabaseClient | null = null;
    if (overrideUrl && overrideKey) {
      clientToTest = createClient(overrideUrl.trim(), overrideKey.trim());
    } else {
      clientToTest = getSupabase();
    }

    if (!clientToTest) {
      return { success: false, message: 'Supabase URL or Anon key is missing.' };
    }

    // Ping check: query public menu_items or reviews (or probe with limit 1)
    const { error } = await clientToTest.from('menu_items').select('id').limit(1);
    if (error && !error.message.includes('relation "public.menu_items" does not exist')) {
      // If table doesn't exist yet, it connected to PostgreSQL successfully
      if (error.message.includes('JWT') || error.message.includes('apikey') || error.message.includes('Invalid API key')) {
        return { success: false, message: `Authentication error: ${error.message}` };
      }
    }
    return { success: true, message: 'Successfully connected to your Supabase PostgreSQL database!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Connection test failed' };
  }
}

// Helper functions for Supabase data sync
export async function syncOrderToSupabase(orderData: any) {
  const client = getSupabase();
  if (!client) return null;
  try {
    const { data, error } = await client.from('orders').insert([orderData]).select().single();
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
  const client = getSupabase();
  if (!client) return null;
  try {
    const { data, error } = await client.from('bookings').insert([bookingData]).select().single();
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
  const client = getSupabase();
  if (!client) return null;
  try {
    const { data, error } = await client.from('reviews').insert([reviewData]).select().single();
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

// Backward-compatible named exports
export const supabase = getSupabase();
export const isSupabaseConfigured = isSupabaseReady();
