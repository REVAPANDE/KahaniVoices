import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStorySchema } from "@shared/schema";
import { z } from "zod";

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
      res.status(201).json(story);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid story data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create story" });
    }
  });

  // Get featured stories
  app.get("/api/stories/featured", async (req, res) => {
    try {
      const stories = await storage.getFeaturedStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured stories" });
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

  // Admin routes for story moderation (simplified for demo)
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
      res.status(500).json({ message: "Failed to update story status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
