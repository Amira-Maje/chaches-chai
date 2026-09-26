import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, User, ShoppingBag, Calendar, Clock, LogOut, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'orders' | 'bookings'>('orders');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancelLoadingId, setCancelLoadingId] = useState<number | null>(null);

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
    if (isOpen && user && token) {
      fetchUserData();
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
      console.error('Error cancelling reservation:', err);
    } finally {
      setCancelLoadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#FEF9F3] rounded-3xl shadow-2xl border border-[#E6E2DC] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#2D1B13] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-16 h-16 rounded-full border-2 border-[#E89F53] object-cover shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#8E3A1D] flex items-center justify-center text-white text-xl font-bold border-2 border-[#E89F53]">
                {user?.displayName?.[0] || user?.email?.[0] || 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {user?.displayName || 'Chai Lover'}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E89F53]/20 text-[#E89F53] border border-[#E89F53]/30">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-[#D1C7BD] mt-0.5">{user?.email}</p>
              {dbUser && (
                <p className="text-[11px] text-[#A6998B] mt-1">
                  Member Account #{dbUser.id}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-[#E89F53] text-[#2D1B13]'
                    : 'bg-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                My Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'bookings'
                    ? 'bg-[#E89F53] text-[#2D1B13]'
                    : 'bg-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                My Baithak Bookings ({bookings.length})
              </button>
            </div>

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
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#7D5447]">
              <RefreshCw className="w-7 h-7 animate-spin mb-2 text-[#C85A32]" />
              <p className="text-xs font-semibold">Fetching your records from database...</p>
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
                    } catch {}

                    return (
                      <div
                        key={ord.id}
                        className="bg-white rounded-2xl p-4 border border-[#E6E2DC] shadow-xs flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between border-b border-[#F2EDE7] pb-2.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#1D1B18]">
                                Order #{ord.id}
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                  ord.status === 'confirmed'
                                    ? 'bg-amber-100 text-amber-800'
                                    : ord.status === 'brewing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : ord.status === 'completed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-stone-100 text-stone-700'
                                }`}
                              >
                                {ord.status}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#7D5447]">
                              {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-bold text-[#8E3A1D]">
                              ₹{ord.total}
                            </span>
                            <p className="text-[10px] text-[#7D5447] capitalize">
                              {ord.orderType}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          {parsedItems.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs text-[#514440] flex justify-between items-center"
                            >
                              <span>
                                {item.quantity}x {item.item?.name || item.name || 'Chai item'}
                              </span>
                              <span className="font-semibold text-[#1D1B18]">
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
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};
