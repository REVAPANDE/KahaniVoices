import { db } from "./db";
import { categories } from "@shared/schema";

export async function initializeDatabase() {
  try {
    console.log("Initializing database...");
    
    // Test database connection
    await db.select().from(categories).limit(1);
    console.log("Database connection successful");
    
    // Check if categories exist
    const existingCategories = await db.select().from(categories);
    
    if (existingCategories.length === 0) {
      console.log("Setting up default categories...");
      
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

      await db.insert(categories).values(defaultCategories);
      console.log("Default categories created successfully");
    } else {
      console.log(`Found ${existingCategories.length} existing categories, skipping initialization`);
    }
    
    console.log("Database initialization completed successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    console.error("Make sure your DATABASE_URL is correct and the database is accessible");
    throw error;
  }
}