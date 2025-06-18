import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import StoryCard from "@/components/StoryCard";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Shield, HandHeart, Eye, Users } from "lucide-react";
import type { Story, Category } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();

  const { data: categories = [] } = useQuery<(Category & { storyCount: number })[]>({
    queryKey: ["/api/categories"],
  });

  const { data: featuredStories = [] } = useQuery<Story[]>({
    queryKey: ["/api/stories/featured"],
  });

  const { data: recentStories = [] } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2B5A3E] to-[#87A96B] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6 font-serif">Every Voice Matters</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Kahani is a platform where real stories create real change. Share your experiences, 
            amplify marginalized voices, and build a community where authenticity drives impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-[#D4A574] text-[#2C3E50] px-8 py-4 rounded-full font-semibold hover:bg-opacity-90"
              onClick={() => setLocation("/submit")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Share Your Story
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#2B5A3E]"
              onClick={() => setLocation("/stories")}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Read Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Story Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#2C3E50] mb-4 font-serif">Voices That Need to Be Heard</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse stories by the communities and causes that matter most to you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                description={category.description}
                icon={category.icon}
                gradient={category.gradient}
                storyCount={category.storyCount}
                onClick={() => setLocation(`/stories?category=${category.slug}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="py-16 bg-[#F8F6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-3xl font-bold text-[#2C3E50] font-serif">Featured Stories</h3>
              <p className="text-gray-600 mt-2">Powerful voices that inspire change</p>
            </div>
            <Button 
              variant="ghost"
              className="text-[#2B5A3E] font-semibold hover:underline"
              onClick={() => setLocation("/stories")}
            >
              View All Stories
            </Button>
          </div>

          {/* Featured Stories or Empty State */}
          {featuredStories.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStories.slice(0, 6).map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onClick={() => setLocation(`/stories/${story.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-[#2B5A3E] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-[#2B5A3E]" />
              </div>
              <h4 className="text-2xl font-semibold text-[#2C3E50] mb-4 font-serif">Ready for Your First Story</h4>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Kahani is brand new and waiting for authentic voices like yours. Be among the first to share your story and help build this community.
              </p>
              <Button 
                size="lg"
                className="bg-[#2B5A3E] text-white px-8 py-4 rounded-full font-semibold hover:bg-opacity-90"
                onClick={() => setLocation("/submit")}
              >
                <Plus className="w-5 h-5 mr-2" />
                Submit the First Story
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Recent Stories */}
      {recentStories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-3xl font-bold text-[#2C3E50] font-serif">Recent Stories</h3>
                <p className="text-gray-600 mt-2">Latest additions to our community</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentStories.slice(0, 6).map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onClick={() => setLocation(`/stories/${story.id}`)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community Guidelines */}
      <section className="py-16 bg-[#F8F6F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#2C3E50] mb-4 font-serif">Community Guidelines</h3>
            <p className="text-gray-600">Creating a safe, respectful space for authentic storytelling</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-[#2B5A3E] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-[#2B5A3E] w-6 h-6" />
              </div>
              <h4 className="font-semibold text-lg mb-3 text-[#2C3E50]">Safe Space Promise</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                We're committed to maintaining a respectful environment where all voices are heard and protected. 
                Stories are moderated to ensure authenticity and prevent harmful content.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-[#D4A574] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <HandHeart className="text-[#D4A574] w-6 h-6" />
              </div>
              <h4 className="font-semibold text-lg mb-3 text-[#2C3E50]">Authentic Stories</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                We celebrate real experiences and genuine voices. Every story shared should come from personal 
                experience or direct involvement in the events described.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-[#87A96B] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Eye className="text-[#87A96B] w-6 h-6" />
              </div>
              <h4 className="font-semibold text-lg mb-3 text-[#2C3E50]">Privacy Protection</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your privacy matters. You can choose to share anonymously, and we never publish personal 
                information without explicit consent. Your email remains private.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-[#E67E22] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Users className="text-[#E67E22] w-6 h-6" />
              </div>
              <h4 className="font-semibold text-lg mb-3 text-[#2C3E50]">Community Support</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Stories create connections. We encourage supportive dialogue and provide resources for those 
                who need additional help after sharing their experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C3E50] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <h4 className="text-2xl font-bold mb-4 font-serif">कहानी</h4>
              <p className="text-gray-300 mb-6 max-w-md">
                A platform dedicated to amplifying authentic voices and creating meaningful connections 
                through real-life storytelling.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Platform</h5>
              <ul className="space-y-2 text-gray-300">
                <li><Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto" onClick={() => setLocation("/stories")}>Browse Stories</Button></li>
                <li><Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto" onClick={() => setLocation("/submit")}>Submit Story</Button></li>
                <li><Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto" onClick={() => setLocation("/stories")}>Categories</Button></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-300">
                <li><Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">Community Guidelines</Button></li>
                <li><Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">Privacy Policy</Button></li>
                <li><Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">Terms of Service</Button></li>
                <li><Button variant="ghost" className="text-gray-300 hover:text-white p-0 h-auto">Contact Us</Button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-600 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Kahani. Built with love for authentic voices and real stories.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
