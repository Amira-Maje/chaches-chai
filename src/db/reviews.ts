import { db } from './index.ts';
import { reviews } from './schema.ts';
import { desc, eq, sql } from 'drizzle-orm';

export async function getReviews() {
  try {
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  } catch (error) {
    console.error('Error fetching reviews from DB:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function createReview(data: typeof reviews.$inferInsert) {
  try {
    const result = await db.insert(reviews).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Error creating review in DB:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function incrementHelpfulCount(id: number) {
  try {
    const result = await db
      .update(reviews)
      .set({
        helpfulCount: sql`${reviews.helpfulCount} + 1`,
      })
      .where(eq(reviews.id, id))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Error incrementing review helpful count in DB:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
