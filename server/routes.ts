import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStorySchema, stories } from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { eq } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all approved stories
  app.get("/api/stories", async (req, res) => {
    try {
      const { category, search } = req.query;
      let stories;
      
      if (search && typeof search === 'string') {
        stories = await storage.searchStories(search);
      } else if (category && typeof category === 'string') {
        stories = await storage.getStoriesByCategory(category);
      } else {
        stories = await storage.getStories("approved");
      }
      
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  // Get single story by ID
  app.get("/api/stories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const story = await storage.getStory(id);
      
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      
      if (story.status !== "approved") {
        return res.status(404).json({ message: "Story not available" });
      }
      
      res.json(story);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch story" });
    }
  });

  // Create new story
  app.post("/api/stories", async (req, res) => {
    try {
      const validatedData = insertStorySchema.parse(req.body);
      const story = await storage.createStory(validatedData);
      
      // Auto-approve the story for now (you can change this later)
      const approvedStory = await storage.updateStoryStatus(story.id, "approved");
      
      res.status(201).json(approvedStory || story);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid story data", 
          errors: error.errors 
        });
      }
      console.error("Story creation error:", error);
      res.status(500).json({ message: "Failed to create story" });
    }
  });

  // Get featured stories
  app.get("/api/stories/featured", async (req, res) => {
    try {
      const stories = await storage.getFeaturedStories();
      res.json(stories);
    } catch (error) {
      console.error("Featured stories error:", error);
      res.json([]); // Return empty array instead of error
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      // Add story counts
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          const stories = await storage.getStoriesByCategory(category.slug);
          return { ...category, storyCount: stories.length };
        })
      );
      res.json(categoriesWithCounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get pending stories (for admin review)
  app.get("/api/admin/stories/pending", async (req, res) => {
    try {
      const stories = await storage.getStories("pending");
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending stories" });
    }
  });

  // Admin routes for story moderation
  app.patch("/api/stories/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const story = await storage.updateStoryStatus(id, status);
      
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      
      res.json(story);
    } catch (error) {
      console.error("Status update error:", error);
      res.status(500).json({ message: "Failed to update story status" });
    }
  });

  // Feature/unfeature a story
  app.patch("/api/stories/:id/feature", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { featured } = req.body;
      
      const [story] = await db
        .update(stories)
        .set({ featured, updatedAt: new Date() })
        .where(eq(stories.id, id))
        .returning();
      
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      
      res.json(story);
    } catch (error) {
      console.error("Feature update error:", error);
      res.status(500).json({ message: "Failed to update story" });
    }
  });

  // Delete a story
  app.delete("/api/stories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const [deletedStory] = await db
        .delete(stories)
        .where(eq(stories.id, id))
        .returning();
      
      if (!deletedStory) {
        return res.status(404).json({ message: "Story not found" });
      }
      
      res.json({ message: "Story deleted successfully", story: deletedStory });
    } catch (error) {
      console.error("Delete story error:", error);
      res.status(500).json({ message: "Failed to delete story" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
