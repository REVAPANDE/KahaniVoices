import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate, getReadingTime, truncateText } from "@/lib/utils";
import { Check, X, Star, Eye, Clock, User } from "lucide-react";
import type { Story } from "@shared/schema";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allStories = [], isLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories", "all"],
    queryFn: async () => {
      const response = await fetch("/api/stories");
      return response.json();
    },
  });

  const { data: pendingStories = [] } = useQuery<Story[]>({
    queryKey: ["/api/admin/stories/pending"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/stories/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stories/pending"] });
      toast({
        title: "Story Updated",
        description: "Story status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update story status.",
        variant: "destructive",
      });
    },
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      const response = await apiRequest("PATCH", `/api/stories/${id}/feature`, { featured });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      toast({
        title: "Story Updated",
        description: "Story featured status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update featured status.",
        variant: "destructive",
      });
    },
  });

  const approvedStories = allStories.filter(story => story.status === "approved");
  const rejectedStories = allStories.filter(story => story.status === "rejected");
  const pendingStoriesCount = allStories.filter(story => story.status === "pending").length;
  const featuredStoriesCount = allStories.filter(story => story.featured).length;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#2C3E50] mb-4 font-serif">Story Management</h1>
            <p className="text-gray-600">Review and manage submitted stories</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-[#2B5A3E] mb-2">{allStories.length}</div>
                <div className="text-sm text-gray-600">Total Stories</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-[#E67E22] mb-2">{pendingStoriesCount}</div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-[#27AE60] mb-2">{approvedStories.length}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-[#F39C12] mb-2">{featuredStoriesCount}</div>
                <div className="text-sm text-gray-600">Featured</div>
              </CardContent>
            </Card>
          </div>

          {/* All Stories */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-[#2C3E50] font-serif">All Stories</h2>
            
            {allStories.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600 mb-4">No stories submitted yet.</p>
                  <Button 
                    onClick={() => setLocation("/submit")}
                    className="bg-[#2B5A3E] text-white hover:bg-opacity-90"
                  >
                    Submit First Story
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {allStories.map((story) => (
                  <Card key={story.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge 
                              variant={
                                story.status === "approved" ? "default" : 
                                story.status === "pending" ? "secondary" : "destructive"
                              }
                              className={
                                story.status === "approved" ? "bg-[#27AE60] text-white" :
                                story.status === "pending" ? "bg-[#E67E22] text-white" :
                                "bg-[#E74C3C] text-white"
                              }
                            >
                              {story.status}
                            </Badge>
                            {story.featured && (
                              <Badge className="bg-[#F39C12] text-white">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            <Badge variant="outline">
                              {story.category.replace('-', ' ')}
                            </Badge>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">
                            {story.title || "Untitled Story"}
                          </h3>
                          
                          <p className="text-gray-600 mb-3">
                            {truncateText(story.content.replace(/<[^>]*>/g, ''), 120)}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{story.authorName}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{getReadingTime(story.content)} min read</span>
                            </div>
                            <span>{formatDate(story.createdAt!)}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-6">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setLocation(`/stories/${story.id}`)}
                              className="text-[#2B5A3E] border-[#2B5A3E] hover:bg-[#2B5A3E] hover:text-white"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            
                            <Button
                              size="sm"
                              variant={story.featured ? "default" : "outline"}
                              onClick={() => toggleFeatureMutation.mutate({ 
                                id: story.id, 
                                featured: !story.featured 
                              })}
                              disabled={toggleFeatureMutation.isPending}
                              className={story.featured ? 
                                "bg-[#F39C12] text-white hover:bg-opacity-90" : 
                                "text-[#F39C12] border-[#F39C12] hover:bg-[#F39C12] hover:text-white"
                              }
                            >
                              <Star className="w-4 h-4 mr-1" />
                              {story.featured ? "Unfeature" : "Feature"}
                            </Button>
                          </div>
                          
                          {story.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateStatusMutation.mutate({ 
                                  id: story.id, 
                                  status: "approved" 
                                })}
                                disabled={updateStatusMutation.isPending}
                                className="bg-[#27AE60] text-white hover:bg-opacity-90"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateStatusMutation.mutate({ 
                                  id: story.id, 
                                  status: "rejected" 
                                })}
                                disabled={updateStatusMutation.isPending}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                          
                          {story.status === "rejected" && (
                            <Button
                              size="sm"
                              onClick={() => updateStatusMutation.mutate({ 
                                id: story.id, 
                                status: "approved" 
                              })}
                              disabled={updateStatusMutation.isPending}
                              className="bg-[#27AE60] text-white hover:bg-opacity-90"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}