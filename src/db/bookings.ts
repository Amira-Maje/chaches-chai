import { db } from './index.ts';
import { bookings } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export async function createBooking(data: typeof bookings.$inferInsert) {
  try {
    const result = await db.insert(bookings).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Error creating booking in DB:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getBookingsByUser(userId: string) {
  try {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  } catch (error) {
    console.error('Error fetching user bookings from DB:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function cancelBooking(id: number, userId?: string) {
  try {
    const query = db
      .update(bookings)
      .set({ status: 'cancelled' })
      .where(eq(bookings.id, id));
    
    const result = await query.returning();
    return result[0] || null;
  } catch (error) {
    console.error('Error cancelling booking in DB:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
