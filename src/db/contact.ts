import { db } from './index.ts';
import { contactMessages } from './schema.ts';

export async function createContactMessage(data: typeof contactMessages.$inferInsert) {
  try {
    const result = await db.insert(contactMessages).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Error saving contact message in DB:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
