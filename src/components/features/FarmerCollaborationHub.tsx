import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Eye,
  Star,
  MapPin,
  Calendar,
  Award,
  Zap,
  TrendingUp,
  CheckCircle,
  Plus,
  Camera,
  Upload
} from "lucide-react";
import { toast } from "sonner";

interface FarmerPost {
  id: string;
  farmer: string;
  location: string;
  avatar: string;
  timestamp: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  category: "success" | "question" | "tip" | "problem";
  verified?: boolean;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

export const FarmerCollaborationHub = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newPost, setNewPost] = useState("");
  const [selectedPost, setSelectedPost] = useState<FarmerPost | null>(null);
  const [showComments, setShowComments] = useState(false);

  const farmerPosts: FarmerPost[] = [
    {
      id: "1",
      farmer: "Rajesh Kumar",
      location: "Punjab, India",
      avatar: "/api/placeholder/40/40",
      timestamp: "2 hours ago",
      content: "🌾 Amazing results with my wheat crop this season! Used the AI recommendations from this app and got 35% more yield than last year. The drip irrigation calculator was spot on! Here's my field before and after photos.",
      images: ["/api/placeholder/300/200", "/api/placeholder/300/200"],
      likes: 47,
      comments: 12,
      shares: 8,
      category: "success",
      verified: true
    },
    {
      id: "2",
      farmer: "Priya Sharma",
      location: "Maharashtra, India",
      avatar: "/api/placeholder/40/40",
      timestamp: "4 hours ago",
      content: "🤔 Need help! My cotton plants are showing yellow leaves in some patches. Weather has been normal, irrigation is regular. Has anyone faced this issue? The AI disease scanner detected possible nutrient deficiency but I want to hear from experienced farmers too.",
      likes: 23,
      comments: 18,
      shares: 5,
      category: "question"
    },
    {
      id: "3",
      farmer: "Suresh Patel",
      location: "Gujarat, India",
      avatar: "/api/placeholder/40/40",
      timestamp: "1 day ago",
      content: "💡 Pro tip: I've been intercropping maize with soybean for 3 years now. The rotation optimizer in this app helped me plan it perfectly. 25% increase in total income and much better soil health. The key is getting the spacing right - 2:1 ratio works best for our soil type.",
      likes: 89,
      comments: 25,
      shares: 34,
      category: "tip",
      verified: true
    },
    {
      id: "4",
      farmer: "Anita Reddy",
      location: "Andhra Pradesh, India",
      avatar: "/api/placeholder/40/40",
      timestamp: "2 days ago",
      content: "🚨 Warning: Heavy pest attack on rice crops in our area. Started yesterday. Using the app's pest management recommendations. Neem oil spray worked well initially but may need stronger action. Other farmers in Guntur district please be alert!",
      likes: 156,
      comments: 43,
      shares: 78,
      category: "problem"
    }
  ];

  const comments: Comment[] = [
    {
      id: "1",
      author: "Mohan Singh",
      content: "This is exactly what I needed! Can you share more details about the irrigation schedule you followed?",
      timestamp: "1 hour ago",
      likes: 8
    },
    {
      id: "2",
      author: "Sunita Devi",
      content: "Congratulations! Your field looks amazing. Which variety of wheat did you use?",
      timestamp: "45 minutes ago",
      likes: 5
    },
    {
      id: "3",
      author: "Vikram Joshi",
      content: "I got similar results in Haryana. The AI recommendations are really accurate if you follow them properly.",
      timestamp: "30 minutes ago",
      likes: 12
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "success": return <Award className="h-4 w-4 text-green-500" />;
      case "question": return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "tip": return <Zap className="h-4 w-4 text-yellow-500" />;
      case "problem": return <CheckCircle className="h-4 w-4 text-red-500" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "success": return "bg-green-100 text-green-700";
      case "question": return "bg-blue-100 text-blue-700";
      case "tip": return "bg-yellow-100 text-yellow-700";
      case "problem": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredPosts = selectedCategory === "all" 
    ? farmerPosts 
    : farmerPosts.filter(post => post.category === selectedCategory);

  const handleLike = (postId: string) => {
    toast("Post liked!");
  };

  const handleShare = (postId: string) => {
    toast("Post shared!");
  };

  const handleComment = (post: FarmerPost) => {
    setSelectedPost(post);
    setShowComments(true);
  };

  const submitPost = () => {
    if (newPost.trim()) {
      toast("Post shared with the community!");
      setNewPost("");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Farmer Collaboration Hub
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Connect, share knowledge, and learn from fellow farmers worldwide
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
            <TabsTrigger value="experts">Experts</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feed" className="space-y-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                All Posts
              </Button>
              <Button
                variant={selectedCategory === "success" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("success")}
                className="flex items-center gap-1"
              >
                <Award className="h-3 w-3" />
                Success Stories
              </Button>
              <Button
                variant={selectedCategory === "question" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("question")}
                className="flex items-center gap-1"
              >
                <MessageSquare className="h-3 w-3" />
                Questions
              </Button>
              <Button
                variant={selectedCategory === "tip" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("tip")}
                className="flex items-center gap-1"
              >
                <Zap className="h-3 w-3" />
                Tips & Tricks
              </Button>
              <Button
                variant={selectedCategory === "problem" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("problem")}
                className="flex items-center gap-1"
              >
                <CheckCircle className="h-3 w-3" />
                Problems & Alerts
              </Button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.avatar}
                          alt={post.farmer}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{post.farmer}</h4>
                            {post.verified && (
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{post.location}</span>
                            <span>•</span>
                            <Calendar className="h-3 w-3" />
                            <span>{post.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getCategoryColor(post.category)}>
                        {getCategoryIcon(post.category)}
                        <span className="ml-1 capitalize">{post.category}</span>
                      </Badge>
                    </div>

                    {/* Post Content */}
                    <p className="mb-3 text-sm leading-relaxed">{post.content}</p>

                    {/* Post Images */}
                    {post.images && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {post.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt="Post image"
                            className="rounded-lg object-cover h-32 w-full"
                          />
                        ))}
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-1"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleComment(post)}
                          className="flex items-center gap-1"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(post.id)}
                          className="flex items-center gap-1"
                        >
                          <Share2 className="h-4 w-4" />
                          <span>{post.shares}</span>
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="share" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share Your Experience</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Help fellow farmers by sharing your knowledge, success stories, or asking questions
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="What's on your mind? Share your farming experience, ask a question, or give tips to other farmers..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={4}
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-1" />
                      Photo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-1" />
                      Document
                    </Button>
                    <Button variant="outline" size="sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      Location
                    </Button>
                  </div>
                  
                  <Button onClick={submitPost} disabled={!newPost.trim()}>
                    <Plus className="h-4 w-4 mr-1" />
                    Share Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Post Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Post Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { icon: Award, title: "Success Story", template: "🌾 Great results with my [crop] this season! [Describe your success and methods used]" },
                    { icon: MessageSquare, title: "Ask Question", template: "🤔 Need help with [specific problem]. Has anyone experienced [describe issue]?" },
                    { icon: Zap, title: "Share Tip", template: "💡 Pro tip: [Your farming tip or technique that worked well]" },
                    { icon: CheckCircle, title: "Alert/Warning", template: "🚨 Alert: [Describe problem/pest/disease] in [location]. [Prevention/solution advice]" }
                  ].map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-3 text-left justify-start"
                      onClick={() => setNewPost(template.template)}
                    >
                      <template.icon className="h-5 w-5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{template.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {template.template.substring(0, 50)}...
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="experts" className="space-y-4">
            <div className="grid gap-4">
              {[
                { name: "Dr. Ramesh Chand", expertise: "Soil Science", rating: 4.9, consultations: 1247, verified: true },
                { name: "Prof. Sunita Verma", expertise: "Crop Protection", rating: 4.8, consultations: 892, verified: true },
                { name: "Amit Agricultural Expert", expertise: "Organic Farming", rating: 4.7, consultations: 634, verified: false },
                { name: "Dr. Krishnan Pillai", expertise: "Water Management", rating: 4.9, consultations: 1108, verified: true }
              ].map((expert, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {expert.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{expert.name}</h4>
                            {expert.verified && (
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{expert.expertise}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{expert.rating}</span>
                            </div>
                            <span>{expert.consultations} consultations</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm">
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "Suresh Patel", points: 2847, posts: 23, helpful: 89, location: "Gujarat" },
                    { rank: 2, name: "Rajesh Kumar", points: 2234, posts: 18, helpful: 76, location: "Punjab" },
                    { rank: 3, name: "Priya Sharma", points: 1923, posts: 15, helpful: 62, location: "Maharashtra" },
                    { rank: 4, name: "Anita Reddy", points: 1756, posts: 19, helpful: 58, location: "Andhra Pradesh" },
                    { rank: 5, name: "Mohan Singh", points: 1543, posts: 12, helpful: 51, location: "Haryana" }
                  ].map((farmer) => (
                    <div key={farmer.rank} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          farmer.rank === 1 ? 'bg-yellow-500' : 
                          farmer.rank === 2 ? 'bg-gray-400' : 
                          farmer.rank === 3 ? 'bg-orange-600' : 'bg-blue-500'
                        }`}>
                          {farmer.rank}
                        </div>
                        <div>
                          <p className="font-semibold">{farmer.name}</p>
                          <p className="text-xs text-muted-foreground">{farmer.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{farmer.points} pts</p>
                        <p className="text-xs text-muted-foreground">
                          {farmer.posts} posts • {farmer.helpful} helpful
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Achievement Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { icon: "🏆", title: "Top Helper", desc: "Most helpful answers" },
                    { icon: "🌟", title: "Rising Star", desc: "Fast growing contributor" },
                    { icon: "📚", title: "Knowledge Guru", desc: "Expert-level posts" },
                    { icon: "🤝", title: "Community Builder", desc: "Active participation" },
                    { icon: "🔬", title: "Innovation Pioneer", desc: "Advanced techniques" },
                    { icon: "🌱", title: "Green Thumb", desc: "Sustainable practices" },
                    { icon: "📈", title: "Success Coach", desc: "Inspiring others" },
                    { icon: "🎯", title: "Problem Solver", desc: "Quick solutions" }
                  ].map((badge, index) => (
                    <div key={index} className="text-center p-3 border rounded-lg">
                      <div className="text-2xl mb-1">{badge.icon}</div>
                      <p className="font-medium text-sm">{badge.title}</p>
                      <p className="text-xs text-muted-foreground">{badge.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};