import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import blogHero from "@/assets/blog-hero.jpg";
import blog1 from "@/assets/blog1.jpg";
import blog2 from "@/assets/blog2.jpg";
import blog3 from "@/assets/blog3.jpg";
import blog4 from "@/assets/blog4.jpg";
import athlete1 from "@/assets/athlete-1.jpg";
import athlete2 from "@/assets/athlete-2.jpg";
import athlete3 from "@/assets/athlete-3.jpg";
import { 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Trophy,
  Users,
  Flame,
  Target,
  ChevronRight,
  BookOpen,
  Star
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: string;
  featured: boolean;
  image: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Science of Peak Performance: Training Like Elite Athletes",
    excerpt: "Discover the cutting-edge training methodologies used by world-class athletes to achieve peak performance consistently.",
    content: "",
    category: "Training Tips",
    author: {
      name: "Dr. Sarah Mitchell",
      avatar: athlete1,
      role: "Sports Scientist"
    },
    publishedAt: "2024-02-15",
    readTime: "8 min read",
    featured: true,
    image: blog1,
    tags: ["Training", "Performance", "Science"]
  },
  {
    id: "2",
    title: "From Local Courts to Global Stages: Ahmed Khan's Journey",
    excerpt: "An inspiring story of determination and passion as Ahmed Khan rises from local cricket matches to international championships.",
    content: "",
    category: "Athlete Stories",
    author: {
      name: "Michael Torres",
      avatar: athlete2,
      role: "Sports Journalist"
    },
    publishedAt: "2024-02-12",
    readTime: "6 min read",
    featured: true,
    image: blog2,
    tags: ["Cricket", "Inspiration", "Success Story"]
  },
  {
    id: "3",
    title: "Nutrition Strategies for Endurance Athletes",
    excerpt: "Expert nutrition advice to fuel your body for long-distance events and maintain energy throughout competitions.",
    content: "",
    category: "Nutrition",
    author: {
      name: "Emma Chen",
      avatar: athlete3,
      role: "Sports Nutritionist"
    },
    publishedAt: "2024-02-10",
    readTime: "5 min read",
    featured: false,
    image: blog3,
    tags: ["Nutrition", "Endurance", "Health"]
  },
  {
    id: "4",
    title: "Mental Toughness: The Hidden Champion's Edge",
    excerpt: "Learn psychological techniques used by Olympic athletes to stay focused under pressure and overcome setbacks.",
    content: "",
    category: "Mental Game",
    author: {
      name: "Dr. James Wilson",
      avatar: athlete1,
      role: "Sports Psychologist"
    },
    publishedAt: "2024-02-08",
    readTime: "7 min read",
    featured: false,
    image: blog4,
    tags: ["Mental Health", "Psychology", "Focus"]
  },
  {
    id: "5",
    title: "2024 Sports Technology Trends Reshaping Athletics",
    excerpt: "From AI-powered coaching to wearable tech, explore the innovations transforming how athletes train and compete.",
    content: "",
    category: "Technology",
    author: {
      name: "Lisa Park",
      avatar: athlete2,
      role: "Tech Analyst"
    },
    publishedAt: "2024-02-05",
    readTime: "6 min read",
    featured: false,
    image: blog1,
    tags: ["Technology", "Innovation", "Wearables"]
  },
  {
    id: "6",
    title: "Recovery Secrets: How Pros Bounce Back Faster",
    excerpt: "Professional recovery techniques that help elite athletes minimize downtime and prevent injuries.",
    content: "",
    category: "Recovery",
    author: {
      name: "Mark Thompson",
      avatar: athlete3,
      role: "Physiotherapist"
    },
    publishedAt: "2024-02-03",
    readTime: "5 min read",
    featured: false,
    image: blog2,
    tags: ["Recovery", "Injury Prevention", "Wellness"]
  }
];

const categories = [
  { name: "All", icon: BookOpen, count: blogPosts.length },
  { name: "Training Tips", icon: Target, count: 1 },
  { name: "Athlete Stories", icon: Trophy, count: 1 },
  { name: "Nutrition", icon: Flame, count: 1 },
  { name: "Mental Game", icon: Star, count: 1 },
  { name: "Technology", icon: TrendingUp, count: 1 },
  { name: "Recovery", icon: Users, count: 1 }
];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section with Image */}
      <section className="relative min-h-[500px] lg:min-h-[600px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={blogHero} 
            alt="Blog Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </div>
        
        {/* Content */}
        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-6 backdrop-blur-sm">
                <BookOpen className="h-4 w-4" />
                <span>Sportika Blog</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 tracking-tight">
                Insights & <span className="text-primary">Inspiration</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                Expert tips, athlete stories, and the latest in sports technology. 
                Fuel your passion and elevate your game.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  <Trophy className="h-3 w-3 mr-1" /> Training Tips
                </Badge>
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  <Users className="h-3 w-3 mr-1" /> Athlete Stories
                </Badge>
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  <TrendingUp className="h-3 w-3 mr-1" /> Latest Trends
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Categories */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-y border-border/50 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search articles, topics, or athletes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base bg-background"
              />
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.name
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  <category.icon className="h-4 w-4" />
                  {category.name}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    selectedCategory === category.name
                      ? "bg-primary-foreground/20"
                      : "bg-background"
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && selectedCategory === "All" && !searchQuery && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-primary/10">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold">Featured Stories</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <Card 
                  key={post.id} 
                  className={`group overflow-hidden border-0 shadow-xl shadow-black/5 ${
                    index === 0 ? 'lg:row-span-2' : ''
                  }`}
                >
                  <div className={`relative overflow-hidden ${
                    index === 0 ? 'h-80 lg:h-full min-h-[400px]' : 'h-48'
                  }`}>
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className={`p-6 ${index === 0 ? 'lg:p-8' : ''}`}>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </span>
                    </div>
                    
                    <h3 className={`font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors ${
                      index === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'
                    }`}>
                      {post.title}
                    </h3>
                    
                    <p className={`text-muted-foreground mb-4 ${index === 0 ? 'text-base' : 'text-sm line-clamp-2'}`}>
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                            {post.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm text-foreground">{post.author.name}</p>
                          <p className="text-xs text-muted-foreground">{post.author.role}</p>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="group/btn">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold">
                {searchQuery ? 'Search Results' : 'Latest Articles'}
              </h2>
            </div>
            <p className="text-muted-foreground hidden sm:block">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
            </p>
          </div>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchQuery || selectedCategory !== "All" ? filteredPosts : regularPosts).map((post) => (
                <Card key={post.id} className="group overflow-hidden border-0 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    
                    <h3 className="font-display font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {post.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">{post.author.name}</span>
                      </div>
                      
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl shadow-primary/10 overflow-hidden">
            <div className="relative p-8 md:p-12 text-center bg-gradient-to-br from-primary via-primary/90 to-primary/80">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoNHY0aC00ek0yMCAyMGg0djRoLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
              
              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Flame className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                  Stay in the Game
                </h2>
                <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
                  Get the latest training tips, athlete stories, and sports insights delivered straight to your inbox.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input 
                    placeholder="Enter your email"
                    className="h-12 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                  <Button className="h-12 px-8 bg-white text-primary hover:bg-white/90 font-semibold">
                    Subscribe
                  </Button>
                </div>
                <p className="text-white/60 text-sm mt-4">
                  Join 10,000+ athletes and sports enthusiasts
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;