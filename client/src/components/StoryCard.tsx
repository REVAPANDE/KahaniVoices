import { formatDate, getReadingTime, truncateText } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import type { Story } from "@shared/schema";

interface StoryCardProps {
  story: Story;
  onClick?: () => void;
}

export default function StoryCard({ story, onClick }: StoryCardProps) {
  const readingTime = getReadingTime(story.content);
  
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="bg-[#2B5A3E] text-white">
            {story.category.replace('-', ' ')}
          </Badge>
          {story.featured && (
            <Badge className="bg-[#E67E22] text-white">Featured</Badge>
          )}
        </div>
        
        <h3 className="font-serif text-xl font-semibold text-[#2C3E50] mb-3 group-hover:text-[#2B5A3E] transition-colors">
          {story.title}
        </h3>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          {truncateText(story.content.replace(/<[^>]*>/g, ''), 150)}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{story.authorName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
          </div>
          <span>{formatDate(story.createdAt!)}</span>
        </div>
        
        {story.tags && story.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {story.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {story.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{story.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
