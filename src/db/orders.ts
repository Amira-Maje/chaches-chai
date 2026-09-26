import { db } from './index.ts';
import { orders } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export async function createOrder(data: typeof orders.$inferInsert) {
  try {
    const result = await db.insert(orders).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Error creating order in DB:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getOrdersByUser(userId: string) {
  try {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('Error fetching user orders from DB:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getOrderById(id: number) {
  try {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching order by ID from DB:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function updateOrderStatus(id: number, status: string) {
  try {
    const result = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Error updating order status in DB:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
