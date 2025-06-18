import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import StoryCard from "@/components/StoryCard";
import CategoryCard from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, BookOpen } from "lucide-react";
import type { Story, Category } from "@shared/schema";

export default function Stories() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Get URL params for category filter
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get("category");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<(Category & { storyCount: number })[]>({
    queryKey: ["/api/categories"],
  });

  const { data: stories = [], isLoading: storiesLoading } = useQuery<Story[]>({
    queryKey: [
      "/api/stories",
      selectedCategory !== "all" ? selectedCategory : undefined,
      searchQuery || undefined
    ].filter(Boolean),
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category !== "all") {
      setLocation(`/stories?category=${category}`);
    } else {
      setLocation("/stories");
    }
  };

  const filteredStories = stories.filter(story => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        story.title.toLowerCase().includes(query) ||
        story.content.toLowerCase().includes(query) ||
        story.authorName.toLowerCase().includes(query) ||
        story.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const sortedStories = [...filteredStories].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      case "oldest":
        return new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime();
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Set initial category from URL param
  useState(() => {
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  });

  return (
    <div className="min-h-screen">
      <Header onSearch={handleSearch} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2B5A3E] to-[#87A96B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 font-serif">Community Stories</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Discover authentic stories from voices that matter. Every story shared here creates connections and drives change.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Categories Sidebar */}
            <aside className="lg:w-1/4">
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-6 font-serif">Browse by Category</h3>
              
              {categoriesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    className={`w-full justify-start ${
                      selectedCategory === "all" 
                        ? "bg-[#2B5A3E] text-white" 
                        : "text-[#2C3E50] hover:bg-[#2B5A3E] hover:text-white"
                    }`}
                    onClick={() => handleCategorySelect("all")}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    All Stories ({stories.length})
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.slug ? "default" : "outline"}
                      className={`w-full justify-start ${
                        selectedCategory === category.slug 
                          ? "bg-[#2B5A3E] text-white" 
                          : "text-[#2C3E50] hover:bg-[#2B5A3E] hover:text-white"
                      }`}
                      onClick={() => handleCategorySelect(category.slug)}
                    >
                      <i className={`${category.icon} w-4 h-4 mr-2`}></i>
                      {category.name} ({category.storyCount})
                    </Button>
                  ))}
                </div>
              )}
            </aside>

            {/* Main Content */}
            <main className="lg:w-3/4">
              {/* Search and Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Input
                    type="search"
                    placeholder="Search stories, authors, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl focus:ring-2 focus:ring-[#2B5A3E]"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48 rounded-xl">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="title">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters */}
              {(selectedCategory !== "all" || searchQuery) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCategory !== "all" && (
                    <Badge 
                      variant="secondary" 
                      className="bg-[#2B5A3E] text-white px-3 py-1"
                    >
                      Category: {categories.find(c => c.slug === selectedCategory)?.name}
                      <button
                        onClick={() => handleCategorySelect("all")}
                        className="ml-2 hover:text-gray-300"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge 
                      variant="secondary" 
                      className="bg-[#D4A574] text-white px-3 py-1"
                    >
                      Search: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery("")}
                        className="ml-2 hover:text-gray-300"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Stories Grid or Empty State */}
              {storiesLoading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="border rounded-xl p-6">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedStories.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">
                      {sortedStories.length} {sortedStories.length === 1 ? 'story' : 'stories'} found
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {sortedStories.map((story) => (
                      <StoryCard
                        key={story.id}
                        story={story}
                        onClick={() => setLocation(`/stories/${story.id}`)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">No Stories Found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery 
                      ? `No stories match your search for "${searchQuery}"`
                      : selectedCategory !== "all"
                      ? `No stories in the ${categories.find(c => c.slug === selectedCategory)?.name} category yet`
                      : "No stories have been published yet"
                    }
                  </p>
                  <Button 
                    className="bg-[#2B5A3E] text-white hover:bg-opacity-90"
                    onClick={() => setLocation("/submit")}
                  >
                    Be the First to Share
                  </Button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
