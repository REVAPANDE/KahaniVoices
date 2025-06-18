import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertStorySchema } from "@shared/schema";
import type { InsertStory, Category } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";

export default function StorySubmission() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<InsertStory>({
    resolver: zodResolver(insertStorySchema),
    defaultValues: {
      title: "",
      content: "",
      authorName: "",
      authorEmail: "",
      category: "",
      tags: [],
      allowComments: true,
    },
  });

  const [tagsInput, setTagsInput] = useState("");
  const [publishingOptions, setPublishingOptions] = useState({
    reviewBeforePublishing: true,
    allowComments: true,
    notifyResponses: false,
  });

  const createStoryMutation = useMutation({
    mutationFn: async (data: InsertStory) => {
      const response = await apiRequest("POST", "/api/stories", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Story Submitted Successfully!",
        description: "Your story has been submitted for review and will be published once approved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your story. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertStory) => {
    // Process tags
    const processedTags = tagsInput
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const storyData = {
      ...data,
      tags: processedTags.length > 0 ? processedTags : undefined,
      allowComments: publishingOptions.allowComments,
    };

    createStoryMutation.mutate(storyData);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#2C3E50] mb-4 font-serif">Share Your Story</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your story matters. Share your experiences, challenges, and triumphs to inspire and connect with others.
            </p>
          </div>

          <Card className="shadow-xl border border-gray-100">
            <CardContent className="p-8">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Author Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="authorName" className="block text-sm font-semibold text-[#2C3E50] mb-2">
                      Your Name
                    </Label>
                    <Input
                      id="authorName"
                      {...form.register("authorName")}
                      placeholder="Enter your name"
                      className="rounded-xl focus:ring-2 focus:ring-[#2B5A3E]"
                    />
                    {form.formState.errors.authorName && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.authorName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="authorEmail" className="block text-sm font-semibold text-[#2C3E50] mb-2">
                      Email (Private)
                    </Label>
                    <Input
                      id="authorEmail"
                      type="email"
                      {...form.register("authorEmail")}
                      placeholder="your.email@example.com"
                      className="rounded-xl focus:ring-2 focus:ring-[#2B5A3E]"
                    />
                    {form.formState.errors.authorEmail && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.authorEmail.message}</p>
                    )}
                  </div>
                </div>

                {/* Story Title */}
                <div>
                  <Label htmlFor="title" className="block text-sm font-semibold text-[#2C3E50] mb-2">
                    Story Title
                  </Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder="Give your story a compelling title"
                    className="rounded-xl focus:ring-2 focus:ring-[#2B5A3E]"
                  />
                  {form.formState.errors.title && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
                  )}
                </div>

                {/* Category Selection */}
                <div>
                  <Label className="block text-sm font-semibold text-[#2C3E50] mb-2">
                    Category
                  </Label>
                  <Select
                    value={form.watch("category")}
                    onValueChange={(value) => form.setValue("category", value)}
                  >
                    <SelectTrigger className="rounded-xl focus:ring-2 focus:ring-[#2B5A3E]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.category.message}</p>
                  )}
                </div>

                {/* Story Content */}
                <div>
                  <Label className="block text-sm font-semibold text-[#2C3E50] mb-2">
                    Your Story
                  </Label>
                  <RichTextEditor
                    value={form.watch("content")}
                    onChange={(value) => form.setValue("content", value)}
                    placeholder="Tell your story... Share your experiences, challenges, victories, and the lessons you've learned. Your authentic voice is what makes your story powerful."
                    minRows={12}
                  />
                  {form.formState.errors.content && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.content.message}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">Minimum 200 words recommended for a compelling story</p>
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags" className="block text-sm font-semibold text-[#2C3E50] mb-2">
                    Tags (Optional)
                  </Label>
                  <Input
                    id="tags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Add tags separated by commas (e.g., inspiration, community, change)"
                    className="rounded-xl focus:ring-2 focus:ring-[#2B5A3E]"
                  />
                </div>

                {/* Publishing Options */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-[#2C3E50] mb-4">Publishing Options</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="reviewBeforePublishing"
                        checked={publishingOptions.reviewBeforePublishing}
                        onCheckedChange={(checked) =>
                          setPublishingOptions(prev => ({ ...prev, reviewBeforePublishing: !!checked }))
                        }
                      />
                      <Label htmlFor="reviewBeforePublishing" className="text-sm text-gray-700">
                        I want my story to be reviewed before publishing
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="allowComments"
                        checked={publishingOptions.allowComments}
                        onCheckedChange={(checked) =>
                          setPublishingOptions(prev => ({ ...prev, allowComments: !!checked }))
                        }
                      />
                      <Label htmlFor="allowComments" className="text-sm text-gray-700">
                        Allow comments on my story
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="notifyResponses"
                        checked={publishingOptions.notifyResponses}
                        onCheckedChange={(checked) =>
                          setPublishingOptions(prev => ({ ...prev, notifyResponses: !!checked }))
                        }
                      />
                      <Label htmlFor="notifyResponses" className="text-sm text-gray-700">
                        Send me notifications about responses to my story
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={createStoryMutation.isPending}
                    className="bg-[#2B5A3E] text-white px-12 py-4 rounded-full font-semibold hover:bg-opacity-90"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {createStoryMutation.isPending ? "Submitting..." : "Submit Story for Review"}
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">
                    Your story will be reviewed by our team to ensure it meets our community guidelines before being published.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
