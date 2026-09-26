import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  User,
  ShoppingBag,
  Calendar,
  Clock,
  LogOut,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Database,
  Link,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import {
  getActiveSupabaseConfig,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection,
} from '../lib/supabase';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToOrder?: () => void;
  onNavigateToBooking?: () => void;
}

interface OrderRecord {
  id: number;
  userId: string;
  customerName: string;
  customerPhone: string;
  orderType: string;
  items: string;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: string;
  createdAt: string;
}

interface BookingRecord {
  id: number;
  location: string;
  date: string;
  timeSlot: string;
  guests: number;
  zone: string;
  status: string;
  createdAt: string;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  onNavigateToOrder,
  onNavigateToBooking,
}) => {
  const { user, dbUser, token, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'bookings' | 'database'>('orders');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancelLoadingId, setCancelLoadingId] = useState<number | null>(null);

  // Supabase connection state
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [isSupabaseSaved, setIsSupabaseSaved] = useState(false);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const refreshSupabaseState = () => {
    const cfg = getActiveSupabaseConfig();
    setSupabaseUrl(cfg.url);
    setSupabaseAnonKey(cfg.anonKey);
    setIsSupabaseSaved(
      Boolean(
        cfg.url &&
        cfg.anonKey &&
        !cfg.url.includes('your-project-id') &&
        !cfg.anonKey.includes('your-supabase-anon-key')
      )
    );
  };

  const fetchUserData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [ordersRes, bookingsRes] = await Promise.all([
        fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (ordersRes.ok) {
        const orderData = await ordersRes.json();
        setOrders(orderData);
      }
      if (bookingsRes.ok) {
        const bookingData = await bookingsRes.json();
        setBookings(bookingData);
      }
    } catch (err) {
      console.error('Failed to load user account records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshSupabaseState();
      if (user && token) {
        fetchUserData();
      }
    }
  }, [isOpen, user, token]);

  if (!isOpen) return null;

  const handleCancelBooking = async (id: number) => {
    if (!token) return;
    setCancelLoadingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
        );
      }
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    } finally {
      setCancelLoadingId(null);
    }
  };

  const handleConnectSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      setTestResult({ success: false, message: 'Please enter both Supabase URL and Anon Key.' });
      return;
    }
    setTestingSupabase(true);
    setTestResult(null);

    const res = await testSupabaseConnection(supabaseUrl, supabaseAnonKey);
    setTestingSupabase(false);
    setTestResult(res);

    if (res.success) {
      saveSupabaseCredentials(supabaseUrl, supabaseAnonKey);
      setIsSupabaseSaved(true);
    }
  };

  const handleDisconnectSupabase = () => {
    clearSupabaseCredentials();
    setSupabaseUrl('');
    setSupabaseAnonKey('');
    setIsSupabaseSaved(false);
    setTestResult(null);
  };

  const handleCopySchemaNotice = () => {
    setCopiedSchema(true);
    navigator.clipboard?.writeText('-- Run schema in /supabase/schema.sql in Supabase SQL editor');
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-3xl max-w-2xl w-full shadow-2xl border border-[#E6E2DC] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header with profile info */}
        <div className="bg-[#240A03] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Profile'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D9822B] shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#C85A32] flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-bold text-white">
                  {user?.displayName || 'Chai Lover'}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#D9822B]/20 text-[#FFDBCF] px-2 py-0.5 rounded-full border border-[#D9822B]/30">
                  Patron
                </span>
              </div>
              <p className="text-xs text-[#E6E2DC]/80 mt-0.5">{user?.email || 'Guest User'}</p>
              {dbUser && (
                <p className="text-[11px] text-[#D9822B] mt-1 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3 inline" />
                  Synced with Cloud SQL (ID #{dbUser.id})
                </p>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-between border-t border-white/10 mt-6 pt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'bg-[#C85A32] text-white shadow-sm'
                    : 'text-[#E6E2DC]/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                My Orders ({orders.length})
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'bookings'
                    ? 'bg-[#C85A32] text-white shadow-sm'
                    : 'text-[#E6E2DC]/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                My Baithaks ({bookings.length})
              </button>

              <button
                onClick={() => setActiveTab('database')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'database'
                    ? 'bg-[#C85A32] text-white shadow-sm'
                    : 'text-[#E6E2DC]/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Database & Supabase
              </button>
            </div>

            {user && (
              <button
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className="text-xs font-medium text-rose-300 hover:text-rose-100 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#7D5447]">
              <RefreshCw className="w-7 h-7 animate-spin mb-2 text-[#C85A32]" />
              <p className="text-xs font-semibold">Fetching records from PostgreSQL...</p>
            </div>
          ) : activeTab === 'orders' ? (
            <div>
              {orders.length === 0 ? (
                <div className="text-center py-10 text-[#514440]">
                  <ShoppingBag className="w-10 h-10 mx-auto text-[#C85A32]/40 mb-3" />
                  <p className="font-semibold text-sm text-[#1D1B18]">No orders found yet</p>
                  <p className="text-xs text-[#7D5447] mt-1 max-w-sm mx-auto">
                    Craving authentic Kulhad chai or warm buttery Bun Maska? Place your first order online!
                  </p>
                  {onNavigateToOrder && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToOrder();
                      }}
                      className="mt-4 px-4 py-2 bg-[#C85A32] text-white text-xs font-semibold rounded-xl hover:bg-[#A23E18] transition-colors"
                    >
                      Order Online Now
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => {
                    let parsedItems: any[] = [];
                    try {
                      parsedItems = JSON.parse(ord.items);
                    } catch (e) {
                      parsedItems = [];
                    }

                    return (
                      <div
                        key={ord.id}
                        className="bg-white rounded-2xl p-4 border border-[#E6E2DC] shadow-xs flex flex-col gap-3"
                      >
                        <div className="flex items-start justify-between border-b border-[#F0ECE1] pb-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-[#1D1B18]">
                                Order #CC-{ord.id}
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                  ord.status === 'confirmed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : ord.status === 'preparing'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-stone-100 text-stone-700'
                                }`}
                              >
                                {ord.status}
                              </span>
                              <span className="text-[10px] font-medium text-[#7D5447] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E6E2DC]">
                                {ord.orderType === 'delivery' ? '🛵 Home Delivery' : '🛍️ Outlet Pickup'}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#7D5447] mt-1">
                              {new Date(ord.createdAt).toLocaleString(undefined, {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-base font-bold text-[#C85A32]">
                              ₹{ord.total}
                            </span>
                            <p className="text-[10px] text-[#7D5447]">Paid via Cash/UPI</p>
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="space-y-1">
                          {parsedItems.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs text-[#514440] flex items-center justify-between py-0.5"
                            >
                              <span>
                                <span className="font-bold text-[#1D1B18]">{item.quantity}x</span>{' '}
                                {item.name}
                              </span>
                              <span className="font-mono text-[11px] text-[#7D5447]">
                                ₹{(item.pricePerUnit || item.price || 0) * (item.quantity || 1)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : activeTab === 'bookings' ? (
            <div>
              {bookings.length === 0 ? (
                <div className="text-center py-10 text-[#514440]">
                  <Calendar className="w-10 h-10 mx-auto text-[#C85A32]/40 mb-3" />
                  <p className="font-semibold text-sm text-[#1D1B18]">No reservations yet</p>
                  <p className="text-xs text-[#7D5447] mt-1 max-w-sm mx-auto">
                    Reserve an authentic earthen Baithak table with handcrafted brass degchi service.
                  </p>
                  {onNavigateToBooking && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToBooking();
                      }}
                      className="mt-4 px-4 py-2 bg-[#C85A32] text-white text-xs font-semibold rounded-xl hover:bg-[#A23E18] transition-colors"
                    >
                      Book a Baithak
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl p-4 border border-[#E6E2DC] shadow-xs flex flex-col gap-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#1D1B18]">{b.location}</h4>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                b.status === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-200 text-stone-700'
                              }`}
                            >
                              {b.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#514440] mt-1 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#C85A32]" />
                            <span>
                              {b.date} at {b.timeSlot}
                            </span>
                            <span>•</span>
                            <span>{b.guests} Guests</span>
                            <span>•</span>
                            <span className="font-medium">{b.zone}</span>
                          </p>
                        </div>

                        {b.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            disabled={cancelLoadingId === b.id}
                            className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2.5 py-1 rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors disabled:opacity-50"
                          >
                            {cancelLoadingId === b.id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Database & Supabase Integration Panel */
            <div className="space-y-6">
              {/* Cloud SQL Card */}
              <div className="bg-white rounded-2xl p-5 border border-[#E6E2DC] shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1D1B18]">
                        Google Cloud SQL (PostgreSQL)
                      </h4>
                      <p className="text-xs text-[#7D5447]">
                        Region: <span className="font-mono font-medium text-emerald-800">asia-southeast1</span>
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active & Synced
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-[#F0ECE1] grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-[#FAF7F2] p-2 rounded-xl border border-[#E6E2DC]">
                    <span className="text-[10px] text-[#7D5447] uppercase font-bold block">Tables</span>
                    <span className="font-bold text-[#1D1B18]">6 Relations</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-2 rounded-xl border border-[#E6E2DC]">
                    <span className="text-[10px] text-[#7D5447] uppercase font-bold block">ORM</span>
                    <span className="font-bold text-[#1D1B18]">Drizzle ORM</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-2 rounded-xl border border-[#E6E2DC]">
                    <span className="text-[10px] text-[#7D5447] uppercase font-bold block">Auth</span>
                    <span className="font-bold text-[#1D1B18]">Firebase Auth</span>
                  </div>
                </div>
              </div>

              {/* Supabase Connection Card */}
              <div className="bg-white rounded-2xl p-5 border border-[#E6E2DC] shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
                      <Link className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1D1B18]">
                        Supabase Connection
                      </h4>
                      <p className="text-xs text-[#7D5447]">
                        Direct client & real-time sync with Supabase PostgreSQL
                      </p>
                    </div>
                  </div>
                  {isSupabaseSaved ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <Check className="w-3 h-3 text-emerald-700" />
                      Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Not Configured
                    </span>
                  )}
                </div>

                <form onSubmit={handleConnectSupabase} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#514440] mb-1">
                      Supabase Project URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://your-project-id.supabase.co"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#D5CFC9] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C85A32] font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#514440] mb-1">
                      Supabase Anon Public Key
                    </label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseAnonKey}
                      onChange={(e) => setSupabaseAnonKey(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#D5CFC9] bg-[#FAF7F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C85A32] font-mono"
                      required
                    />
                  </div>

                  {testResult && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                        testResult.success
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {testResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <span>{testResult.message}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={testingSupabase}
                      className="flex-1 bg-[#C85A32] hover:bg-[#A23E18] text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {testingSupabase ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Testing Connection...
                        </>
                      ) : isSupabaseSaved ? (
                        'Test & Update Connection'
                      ) : (
                        'Connect Supabase Project'
                      )}
                    </button>

                    {isSupabaseSaved && (
                      <button
                        type="button"
                        onClick={handleDisconnectSupabase}
                        className="px-3 py-2.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                        title="Disconnect Supabase credentials"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Disconnect
                      </button>
                    )}
                  </div>
                </form>

                {/* Schema setup help */}
                <div className="mt-4 p-3 bg-[#FAF7F2] rounded-xl border border-[#E6E2DC] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1D1B18] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      Supabase Schema & RLS Ready
                    </span>
                    <button
                      onClick={handleCopySchemaNotice}
                      className="text-[11px] text-[#C85A32] hover:text-[#A23E18] font-semibold flex items-center gap-1"
                    >
                      {copiedSchema ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedSchema ? 'Copied hint!' : 'View schema.sql'}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#7D5447]">
                    The schema file at <code className="bg-white px-1.5 py-0.5 rounded border font-mono">/supabase/schema.sql</code> includes tables, RLS policies, and triggers for orders, bookings, reviews, and users.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
