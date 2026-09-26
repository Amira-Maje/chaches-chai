import { db } from './index.ts';
import { menuItems } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getMenuItems() {
  try {
    return await db.select().from(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getMenuItemById(id: string) {
  try {
    const items = await db.select().from(menuItems).where(eq(menuItems.id, id)).limit(1);
    return items[0] || null;
  } catch (error) {
    console.error('Error fetching menu item by id:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function insertMenuItem(item: typeof menuItems.$inferInsert) {
  try {
    const result = await db
      .insert(menuItems)
      .values(item)
      .onConflictDoUpdate({
        target: menuItems.id,
        set: item,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Error saving menu item:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
