import { users, stories, categories, type User, type InsertUser, type Story, type InsertStory, type Category, type InsertCategory } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Stories
  getStories(status?: string): Promise<Story[]>;
  getStory(id: number): Promise<Story | undefined>;
  createStory(story: InsertStory): Promise<Story>;
  updateStoryStatus(id: number, status: string): Promise<Story | undefined>;
  getFeaturedStories(): Promise<Story[]>;
  searchStories(query: string): Promise<Story[]>;
  getStoriesByCategory(category: string): Promise<Story[]>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getStories(status?: string): Promise<Story[]> {
    try {
      if (status) {
        const filteredStories = await db
          .select()
          .from(stories)
          .where(eq(stories.status, status));
        return filteredStories.sort((a, b) => 
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
      } else {
        const allStories = await db.select().from(stories);
        return allStories.sort((a, b) => 
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
      }
    } catch (error) {
      console.error("Database error in getStories:", error);
      return [];
    }
  }

  async getStory(id: number): Promise<Story | undefined> {
    const [story] = await db.select().from(stories).where(eq(stories.id, id));
    return story || undefined;
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const [story] = await db
      .insert(stories)
      .values(insertStory)
      .returning();
    return story;
  }

  async updateStoryStatus(id: number, status: string): Promise<Story | undefined> {
    const [story] = await db
      .update(stories)
      .set({ status, updatedAt: new Date() })
      .where(eq(stories.id, id))
      .returning();
    return story || undefined;
  }

  async getFeaturedStories(): Promise<Story[]> {
    try {
      const featuredStories = await db
        .select()
        .from(stories)
        .where(eq(stories.featured, true));
      
      return featuredStories
        .filter(story => story.status === "approved")
        .sort((a, b) => 
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
    } catch (error) {
      console.error("Database error in getFeaturedStories:", error);
      return [];
    }
  }

  async searchStories(query: string): Promise<Story[]> {
    try {
      const allStories = await db
        .select()
        .from(stories)
        .where(eq(stories.status, "approved"));
      
      const lowercaseQuery = query.toLowerCase();
      return allStories
        .filter(story => 
          story.title.toLowerCase().includes(lowercaseQuery) ||
          story.content.toLowerCase().includes(lowercaseQuery) ||
          story.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        )
        .sort((a, b) => 
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
    } catch (error) {
      console.error("Database error in searchStories:", error);
      return [];
    }
  }

  async getStoriesByCategory(category: string): Promise<Story[]> {
    try {
      const categoryStories = await db
        .select()
        .from(stories)
        .where(eq(stories.category, category));
      
      return categoryStories
        .filter(story => story.status === "approved")
        .sort((a, b) => 
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
    } catch (error) {
      console.error("Database error in getStoriesByCategory:", error);
      return [];
    }
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }
}

export const storage = new DatabaseStorage();
