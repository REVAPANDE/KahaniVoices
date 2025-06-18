import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, getReadingTime } from "@/lib/utils";
import { ArrowLeft, Clock, User, Tag, Share2 } from "lucide-react";
import type { Story } from "@shared/schema";

export default function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  
  const { data: story, isLoading, error } = useQuery<Story>({
    queryKey: [`/api/stories/${id}`],
    enabled: !!id,
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story?.title,
          text: `Read "${story?.title}" on Kahani`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-8 w-24 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">Story Not Found</h2>
              <p className="text-gray-600 mb-6">
                The story you're looking for doesn't exist or may have been removed.
              </p>
              <Button 
                onClick={() => setLocation("/stories")}
                className="bg-[#2B5A3E] text-white hover:bg-opacity-90"
              >
                Browse Stories
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const readingTime = getReadingTime(story.content);

  return (
    <div className="min-h-screen">
      <Header />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setLocation("/stories")}
          className="mb-6 text-[#2B5A3E] hover:bg-[#2B5A3E] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Stories
        </Button>

        {/* Story Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-[#2B5A3E] text-white">
              {story.category.replace('-', ' ')}
            </Badge>
            {story.featured && (
              <Badge className="bg-[#E67E22] text-white">Featured</Badge>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-6 font-serif leading-tight">
            {story.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              <span className="font-medium">{story.authorName}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{readingTime} min read</span>
            </div>
            <span>{formatDate(story.createdAt!)}</span>
          </div>

          {/* Share Button */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleShare}
              className="border-[#2B5A3E] text-[#2B5A3E] hover:bg-[#2B5A3E] hover:text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Story
            </Button>
          </div>
        </header>

        {/* Story Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div 
            className="rich-text-content leading-relaxed text-[#2C3E50]"
            dangerouslySetInnerHTML={{ 
              __html: story.content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/_(.*?)_/g, '<u>$1</u>')
                .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-[#2B5A3E] pl-4 italic text-gray-600 my-4">$1</blockquote>')
                .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold text-[#2C3E50] mt-8 mb-4 font-serif">$1</h2>')
                .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
                .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4">$2</li>')
                .replace(/\n/g, '</p><p class="mb-4">')
                .replace(/^/, '<p class="mb-4">')
                .replace(/$/, '</p>')
            }}
          />
        </div>

        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <Tag className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-500">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="border-[#2B5A3E] text-[#2B5A3E] hover:bg-[#2B5A3E] hover:text-white cursor-pointer"
                  onClick={() => setLocation(`/stories?search=${encodeURIComponent(tag)}`)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Story Footer */}
        <footer className="border-t border-gray-200 pt-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Thank you for reading this story. Every voice matters on Kahani.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setLocation("/stories")}
                variant="outline"
                className="border-[#2B5A3E] text-[#2B5A3E] hover:bg-[#2B5A3E] hover:text-white"
              >
                Read More Stories
              </Button>
              <Button
                onClick={() => setLocation("/submit")}
                className="bg-[#2B5A3E] text-white hover:bg-opacity-90"
              >
                Share Your Story
              </Button>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
