import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requireAuth, optionalAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUserByUid } from './src/db/users.ts';
import { getMenuItems, getMenuItemById } from './src/db/menu.ts';
import { createOrder, getOrdersByUser, getOrderById } from './src/db/orders.ts';
import { createBooking, getBookingsByUser, cancelBooking } from './src/db/bookings.ts';
import { getReviews, createReview, incrementHelpfulCount } from './src/db/reviews.ts';
import { createContactMessage } from './src/db/contact.ts';
import { seedInitialDataIfNeeded } from './src/db/seed.ts';
import { syncOrderToSupabase, syncBookingToSupabase, syncReviewToSupabase } from './src/lib/supabase.ts';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Seed initial menu and reviews lazily in the background
  seedInitialDataIfNeeded().catch((err) => {
    console.warn('Initial data seeding notice:', err.message);
  });

  // --- Auth & User Profile Routes ---
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || `${uid}@guest.chachees.com`;
      const { displayName, photoURL } = req.body;
      const user = await getOrCreateUser(uid, email, displayName, photoURL);
      res.json({ success: true, user });
    } catch (error: any) {
      console.error('Failed to sync user profile:', error);
      res.status(500).json({ error: error.message || 'Failed to sync user profile' });
    }
  });

  app.get('/api/auth/me', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const uid = req.user!.uid;
      const user = await getUserByUid(uid);
      if (!user) {
        return res.status(404).json({ error: 'User not found in database' });
      }
      res.json(user);
    } catch (error: any) {
      console.error('Failed to get user profile:', error);
      res.status(500).json({ error: error.message || 'Failed to get user profile' });
    }
  });

  // --- Menu Items Routes ---
  app.get('/api/menu', async (_req: Request, res: Response) => {
    try {
      const items = await getMenuItems();
      res.json(items);
    } catch (error: any) {
      console.error('Failed to fetch menu:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch menu' });
    }
  });

  app.get('/api/menu/:id', async (req: Request, res: Response) => {
    try {
      const item = await getMenuItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
      res.json(item);
    } catch (error: any) {
      console.error('Failed to fetch menu item:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch menu item' });
    }
  });

  // --- Orders Routes ---
  app.get('/api/orders', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const uid = req.user!.uid;
      const userOrders = await getOrdersByUser(uid);
      res.json(userOrders);
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch orders' });
    }
  });

  app.get('/api/orders/:id', async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id, 10);
      if (isNaN(orderId)) {
        return res.status(400).json({ error: 'Invalid order ID' });
      }
      const order = await getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error: any) {
      console.error('Failed to fetch order:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch order' });
    }
  });

  app.post('/api/orders', optionalAuth, async (req: AuthRequest, res: Response) => {
    try {
      const {
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress,
        orderType,
        items,
        subtotal,
        tax,
        deliveryFee,
        total,
        paymentMethod,
        specialInstructions,
      } = req.body;

      if (!customerName || !customerPhone || !items) {
        return res.status(400).json({ error: 'Missing required order fields' });
      }

      const userId = req.user?.uid || null;

      const newOrder = await createOrder({
        userId,
        customerName,
        customerPhone,
        customerEmail: customerEmail || (req.user?.email ?? null),
        deliveryAddress: deliveryAddress || null,
        orderType: orderType || 'takeaway',
        items: typeof items === 'string' ? items : JSON.stringify(items),
        subtotal: Math.round(Number(subtotal) || 0),
        tax: Math.round(Number(tax) || 0),
        deliveryFee: Math.round(Number(deliveryFee) || 0),
        total: Math.round(Number(total) || 0),
        status: 'confirmed',
        paymentMethod: paymentMethod || 'cash_on_delivery',
        specialInstructions: specialInstructions || null,
      });

      // Background sync to Supabase if configured
      syncOrderToSupabase(newOrder).catch((e) => console.warn('Supabase sync notice:', e));

      res.status(201).json({ success: true, order: newOrder });
    } catch (error: any) {
      console.error('Failed to place order:', error);
      res.status(500).json({ error: error.message || 'Failed to place order' });
    }
  });

  // --- Table Bookings Routes ---
  app.get('/api/bookings', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const uid = req.user!.uid;
      const userBookings = await getBookingsByUser(uid);
      res.json(userBookings);
    } catch (error: any) {
      console.error('Failed to fetch bookings:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch bookings' });
    }
  });

  app.post('/api/bookings', optionalAuth, async (req: AuthRequest, res: Response) => {
    try {
      const {
        fullName,
        phone,
        email,
        location,
        date,
        session,
        timeSlot,
        guests,
        zone,
        occasion,
        notes,
        hasChaiFlight,
      } = req.body;

      if (!fullName || !phone || !email || !location || !date || !timeSlot) {
        return res.status(400).json({ error: 'Missing required reservation fields' });
      }

      const userId = req.user?.uid || null;

      const newBooking = await createBooking({
        userId,
        fullName,
        phone,
        email,
        location,
        date,
        session: session || 'Evening Baithak',
        timeSlot,
        guests: parseInt(String(guests), 10) || 2,
        zone: zone || 'Indoor Baithak',
        occasion: occasion || null,
        notes: notes || null,
        hasChaiFlight: Boolean(hasChaiFlight),
        status: 'confirmed',
      });

      // Background sync to Supabase if configured
      syncBookingToSupabase(newBooking).catch((e) => console.warn('Supabase sync notice:', e));

      res.status(201).json({ success: true, booking: newBooking });
    } catch (error: any) {
      console.error('Failed to reserve table:', error);
      res.status(500).json({ error: error.message || 'Failed to reserve table' });
    }
  });

  app.delete('/api/bookings/:id', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const bookingId = parseInt(req.params.id, 10);
      if (isNaN(bookingId)) {
        return res.status(400).json({ error: 'Invalid booking ID' });
      }
      const cancelled = await cancelBooking(bookingId, req.user!.uid);
      res.json({ success: true, booking: cancelled });
    } catch (error: any) {
      console.error('Failed to cancel booking:', error);
      res.status(500).json({ error: error.message || 'Failed to cancel booking' });
    }
  });

  // --- Reviews Routes ---
  app.get('/api/reviews', async (_req: Request, res: Response) => {
    try {
      const allReviews = await getReviews();
      res.json(allReviews);
    } catch (error: any) {
      console.error('Failed to fetch reviews:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch reviews' });
    }
  });

  app.post('/api/reviews', optionalAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { author, branch, rating, text: reviewText, itemsMentioned, badge } = req.body;
      if (!author || !rating || !reviewText) {
        return res.status(400).json({ error: 'Author, rating, and review text are required' });
      }

      const initials = author
        .split(' ')
        .map((p: string) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 3) || 'CL';

      const newReview = await createReview({
        userId: req.user?.uid || null,
        author,
        initials,
        role: 'Verified Chai Connoisseur',
        branch: branch || 'Bandra West, Mumbai',
        rating: Math.min(5, Math.max(1, parseInt(String(rating), 10) || 5)),
        text: reviewText,
        itemsMentioned: typeof itemsMentioned === 'string' ? itemsMentioned : Array.isArray(itemsMentioned) ? itemsMentioned.join(', ') : null,
        helpfulCount: 0,
        verified: true,
        badge: badge || 'Verified Patron',
      });

      // Background sync to Supabase if configured
      syncReviewToSupabase(newReview).catch((e) => console.warn('Supabase sync notice:', e));

      res.status(201).json({ success: true, review: newReview });
    } catch (error: any) {
      console.error('Failed to create review:', error);
      res.status(500).json({ error: error.message || 'Failed to create review' });
    }
  });

  app.post('/api/reviews/:id/helpful', async (req: Request, res: Response) => {
    try {
      const reviewId = parseInt(req.params.id, 10);
      if (isNaN(reviewId)) {
        return res.status(400).json({ error: 'Invalid review ID' });
      }
      const updated = await incrementHelpfulCount(reviewId);
      res.json({ success: true, review: updated });
    } catch (error: any) {
      console.error('Failed to upvote review:', error);
      res.status(500).json({ error: error.message || 'Failed to upvote review' });
    }
  });

  // --- Contact Messages Routes ---
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      const { name, email, phone, topic, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
      }

      const contactMsg = await createContactMessage({
        name,
        email,
        phone: phone || null,
        topic: topic || 'General Inquiry',
        message,
      });

      res.status(201).json({ success: true, message: contactMsg });
    } catch (error: any) {
      console.error('Failed to submit contact message:', error);
      res.status(500).json({ error: error.message || 'Failed to submit message' });
    }
  });

  // --- Vite Dev Server Middleware or Static Build ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
});
