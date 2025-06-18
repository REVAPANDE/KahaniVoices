import { users, stories, categories, type User, type InsertUser, type Story, type InsertStory, type Category, type InsertCategory } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private stories: Map<number, Story>;
  private categories: Map<number, Category>;
  private currentUserId: number;
  private currentStoryId: number;
  private currentCategoryId: number;

  constructor() {
    this.users = new Map();
    this.stories = new Map();
    this.categories = new Map();
    this.currentUserId = 1;
    this.currentStoryId = 1;
    this.currentCategoryId = 1;
    
    // Initialize default categories
    this.initializeCategories();
  }

  private async initializeCategories() {
    const defaultCategories = [
      {
        name: "Social Justice",
        slug: "social-justice",
        description: "Stories of resilience and fighting for equality",
        icon: "fas fa-fist-raised",
        gradient: "from-primary to-sage"
      },
      {
        name: "Identity & Culture",
        slug: "identity-culture",
        description: "Celebrating diverse identities and traditions",
        icon: "fas fa-heart",
        gradient: "from-secondary to-accent"
      },
      {
        name: "Community Impact",
        slug: "community-impact",
        description: "Local heroes making a difference",
        icon: "fas fa-users",
        gradient: "from-sage to-primary"
      },
      {
        name: "Overcoming Challenges",
        slug: "overcoming-challenges",
        description: "Stories of triumph and personal growth",
        icon: "fas fa-seedling",
        gradient: "from-accent to-secondary"
      }
    ];

    for (const category of defaultCategories) {
      await this.createCategory(category);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getStories(status?: string): Promise<Story[]> {
    const allStories = Array.from(this.stories.values());
    if (status) {
      return allStories.filter(story => story.status === status);
    }
    return allStories.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getStory(id: number): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = this.currentStoryId++;
    const now = new Date();
    const story: Story = {
      ...insertStory,
      id,
      status: "pending",
      featured: false,
      createdAt: now,
      updatedAt: now,
    };
    this.stories.set(id, story);
    return story;
  }

  async updateStoryStatus(id: number, status: string): Promise<Story | undefined> {
    const story = this.stories.get(id);
    if (story) {
      const updatedStory = { ...story, status, updatedAt: new Date() };
      this.stories.set(id, updatedStory);
      return updatedStory;
    }
    return undefined;
  }

  async getFeaturedStories(): Promise<Story[]> {
    return Array.from(this.stories.values())
      .filter(story => story.featured && story.status === "approved")
      .sort((a, b) => 
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
  }

  async searchStories(query: string): Promise<Story[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.stories.values())
      .filter(story => 
        story.status === "approved" &&
        (story.title.toLowerCase().includes(lowercaseQuery) ||
         story.content.toLowerCase().includes(lowercaseQuery) ||
         story.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
      )
      .sort((a, b) => 
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
  }

  async getStoriesByCategory(category: string): Promise<Story[]> {
    return Array.from(this.stories.values())
      .filter(story => story.status === "approved" && story.category === category)
      .sort((a, b) => 
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
}

export const storage = new MemStorage();
