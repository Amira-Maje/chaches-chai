import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table linked to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoURL: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Menu items table
export const menuItems = pgTable('menu_items', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  hindiName: text('hindi_name'),
  category: text('category').notNull(), // 'chai' | 'snacks' | 'cold' | 'combos'
  price: integer('price').notNull(),
  cadPrice: text('cad_price'),
  description: text('description').notNull(),
  tag: text('tag'),
  isVeg: boolean('is_veg').default(true).notNull(),
  spiceLevel: text('spice_level'),
  servingInfo: text('serving_info'),
  customizable: boolean('customizable').default(true),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Orders table for online orders and takeaway
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: text('user_id'), // Firebase UID if logged in
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  deliveryAddress: text('delivery_address'),
  orderType: text('order_type').default('takeaway').notNull(), // 'takeaway' | 'delivery'
  items: text('items').notNull(), // JSON string of CartItem[]
  subtotal: integer('subtotal').notNull(),
  tax: integer('tax').notNull(),
  deliveryFee: integer('delivery_fee').default(0).notNull(),
  total: integer('total').notNull(),
  status: text('status').default('confirmed').notNull(), // 'confirmed' | 'brewing' | 'out_for_delivery' | 'completed' | 'cancelled'
  paymentMethod: text('payment_method').default('cash_on_delivery').notNull(),
  specialInstructions: text('special_instructions'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Table Bookings / Baithak Reservations
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  userId: text('user_id'), // Firebase UID if logged in
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  location: text('location').notNull(),
  date: text('date').notNull(),
  session: text('session').notNull(),
  timeSlot: text('time_slot').notNull(),
  guests: integer('guests').notNull(),
  zone: text('zone').notNull(),
  occasion: text('occasion'),
  notes: text('notes'),
  hasChaiFlight: boolean('has_chai_flight').default(false).notNull(),
  status: text('status').default('confirmed').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Customer Reviews & Stories
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  userId: text('user_id'),
  author: text('author').notNull(),
  initials: text('initials').notNull(),
  role: text('role').default('Chai Connoisseur'),
  branch: text('branch').notNull(),
  rating: integer('rating').notNull(),
  text: text('text').notNull(),
  itemsMentioned: text('items_mentioned'), // JSON array or comma separated
  helpfulCount: integer('helpful_count').default(0).notNull(),
  verified: boolean('verified').default(true).notNull(),
  badge: text('badge'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Contact Inquiries
export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  topic: text('topic').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
