import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { IStorage } from './storage';
import type { User, InsertUser, Story, InsertStory, Category, InsertCategory } from '@shared/schema';

const DATA_DIR = './data';
const USERS_FILE = join(DATA_DIR, 'users.json');
const STORIES_FILE = join(DATA_DIR, 'stories.json');
const CATEGORIES_FILE = join(DATA_DIR, 'categories.json');

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (existsSync(filePath)) {
      const data = readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return defaultValue;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

export class FileStorage implements IStorage {
  private users: User[] = [];
  private stories: Story[] = [];
  private categories: Category[] = [];
  private nextUserId = 1;
  private nextStoryId = 1;
  private nextCategoryId = 1;

  constructor() {
    this.loadData();
    this.initializeCategories();
  }

  private loadData() {
    this.users = readJsonFile(USERS_FILE, []);
    this.stories = readJsonFile(STORIES_FILE, []);
    this.categories = readJsonFile(CATEGORIES_FILE, []);

    // Set next IDs
    this.nextUserId = Math.max(...this.users.map(u => u.id), 0) + 1;
    this.nextStoryId = Math.max(...this.stories.map(s => s.id), 0) + 1;
    this.nextCategoryId = Math.max(...this.categories.map(c => c.id), 0) + 1;
  }

  private saveUsers() {
    writeJsonFile(USERS_FILE, this.users);
  }

  private saveStories() {
    writeJsonFile(STORIES_FILE, this.stories);
  }

  private saveCategories() {
    writeJsonFile(CATEGORIES_FILE, this.categories);
  }

  private initializeCategories() {
    if (this.categories.length === 0) {
      const defaultCategories = [
        {
          id: this.nextCategoryId++,
          name: "Social Justice",
          slug: "social-justice",
          description: "Stories of resilience and fighting for equality",
          icon: "fas fa-fist-raised",
          gradient: "from-primary to-sage",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: this.nextCategoryId++,
          name: "Identity & Culture",
          slug: "identity-culture",
          description: "Celebrating diverse identities and traditions",
          icon: "fas fa-heart",
          gradient: "from-secondary to-accent",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: this.nextCategoryId++,
          name: "Community Impact",
          slug: "community-impact",
          description: "Local heroes making a difference",
          icon: "fas fa-users",
          gradient: "from-sage to-primary",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: this.nextCategoryId++,
          name: "Overcoming Challenges",
          slug: "overcoming-challenges",
          description: "Stories of triumph and personal growth",
          icon: "fas fa-seedling",
          gradient: "from-accent to-secondary",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      this.categories = defaultCategories;
      this.saveCategories();
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      ...insertUser,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    this.saveUsers();
    return user;
  }

  async getStories(status?: string): Promise<Story[]> {
    let filteredStories = this.stories;
    if (status) {
      filteredStories = this.stories.filter(story => story.status === status);
    }
    return filteredStories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getStory(id: number): Promise<Story | undefined> {
    return this.stories.find(story => story.id === id);
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const story: Story = {
      id: this.nextStoryId++,
      ...insertStory,
      status: 'approved', // Auto-approve for testing
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.stories.push(story);
    this.saveStories();
    return story;
  }

  async updateStoryStatus(id: number, status: string): Promise<Story | undefined> {
    const story = this.stories.find(s => s.id === id);
    if (story) {
      story.status = status;
      story.updatedAt = new Date();
      this.saveStories();
    }
    return story;
  }

  async getFeaturedStories(): Promise<Story[]> {
    return this.stories
      .filter(story => story.featured === true && story.status === 'approved')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }

  async searchStories(query: string): Promise<Story[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.stories.filter(story => 
      story.status === 'approved' && (
        story.title.toLowerCase().includes(lowercaseQuery) ||
        story.content.toLowerCase().includes(lowercaseQuery) ||
        (story.tags && story.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
      )
    );
  }

  async getStoriesByCategory(category: string): Promise<Story[]> {
    return this.stories.filter(story => 
      story.status === 'approved' && story.category === category
    );
  }

  async getCategories(): Promise<Category[]> {
    return this.categories;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category: Category = {
      id: this.nextCategoryId++,
      ...insertCategory,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.categories.push(category);
    this.saveCategories();
    return category;
  }

  async deleteStory(id: number): Promise<boolean> {
    const index = this.stories.findIndex(story => story.id === id);
    if (index !== -1) {
      this.stories.splice(index, 1);
      this.saveStories();
      return true;
    }
    return false;
  }
}

export const storage = new FileStorage();