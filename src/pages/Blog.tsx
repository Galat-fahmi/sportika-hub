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
  Star,
  Sparkles,
  FileText,
  Activity,
  ArrowUpRight,
  Heart,
  Share2,
  Bookmark
} from "lucide-react";
import { BlogSEO } from "@/components/SEO";

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
    title: "Cricket Training Secrets: Learning from Pakistan's Best",
    excerpt: "Discover the training methodologies used by Pakistan's cricket stars like Babar Azam and Shaheen Afridi to achieve excellence.",
    content: "",
    category: "Training Tips",
    author: {
      name: "Dr. Ayesha Rahman",
      avatar: athlete1,
      role: "Cricket Coach & Sports Scientist"
    },
    publishedAt: "2024-02-15",
    readTime: "8 min read",
    featured: true,
    image: blog1,
    tags: ["Cricket", "Training", "Pakistan Sports"]
  },
  {
    id: "2",
    title: "From Karachi Streets to International Glory: Babar Azam's Journey",
    excerpt: "An inspiring story of how Babar Azam rose from playing cricket in Karachi's streets to becoming Pakistan's cricket captain.",
    content: "",
    category: "Athlete Stories",
    author: {
      name: "Faisal Qureshi",
      avatar: athlete2,
      role: "Sports Journalist - Karachi"
    },
    publishedAt: "2024-02-12",
    readTime: "6 min read",
    featured: true,
    image: blog2,
    tags: ["Cricket", "Pakistan", "Success Story", "Karachi"]
  },
  {
    id: "3",
    title: "Pakistani Diet for Athletes: Traditional Foods for Peak Performance",
    excerpt: "Expert nutrition advice combining traditional Pakistani cuisine with modern sports nutrition for optimal athletic performance.",
    content: "",
    category: "Nutrition",
    author: {
      name: "Dr. Sana Malik",
      avatar: athlete3,
      role: "Sports Nutritionist - Lahore"
    },
    publishedAt: "2024-02-10",
    readTime: "5 min read",
    featured: false,
    image: blog3,
    tags: ["Nutrition", "Pakistani Food", "Health", "Lahore"]
  },
  {
    id: "4",
    title: "Mental Toughness: Lessons from Pakistan Cricket Legends",
    excerpt: "Learn psychological techniques used by Pakistani cricket legends to perform under pressure and overcome challenges.",
    content: "",
    category: "Mental Game",
    author: {
      name: "Dr. Imran Hussain",
      avatar: athlete1,
      role: "Sports Psychologist - Islamabad"
    },
    publishedAt: "2024-02-08",
    readTime: "7 min read",
    featured: false,
    image: blog4,
    tags: ["Mental Health", "Cricket Psychology", "Pakistan"]
  },
  {
    id: "5",
    title: "University Sports in Pakistan: Rising Talent from Campuses",
    excerpt: "Spotlight on emerging athletes from Pakistani universities competing in inter-university championships across Karachi, Lahore, and Islamabad.",
    content: "",
    category: "Athlete Stories",
    author: {
      name: "Zara Ahmed",
      avatar: athlete2,
      role: "University Sports Correspondent"
    },
    publishedAt: "2024-02-05",
    readTime: "6 min read",
    featured: false,
    image: blog1,
    tags: ["University Sports", "Pakistan", "Young Talent"]
  },
  {
    id: "6",
    title: "Football Rising: Pakistan's Growing Football Culture",
    excerpt: "Exploring the grassroots football movement in Pakistan from Rawalpindi to Faisalabad and the talent emerging nationwide.",
    content: "",
    category: "Athlete Stories",
    author: {
      name: "Bilal Khan",
      avatar: athlete3,
      role: "Football Analyst - Rawalpindi"
    },
    publishedAt: "2024-02-03",
    readTime: "5 min read",
    featured: false,
    image: blog2,
    tags: ["Football", "Pakistan", "Rawalpindi", "Faisalabad"]
  }
];

const categories = [
  { name: "All", icon: BookOpen, count: blogPosts.length },
  { name: "Training Tips", icon: Target, count: blogPosts.filter(p => p.category === "Training Tips").length },
  { name: "Athlete Stories", icon: Trophy, count: blogPosts.filter(p => p.category === "Athlete Stories").length },
  { name: "Nutrition", icon: Flame, count: blogPosts.filter(p => p.category === "Nutrition").length },
  { name: "Mental Game", icon: Star, count: blogPosts.filter(p => p.category === "Mental Game").length },
  { name: "Technology", icon: TrendingUp, count: blogPosts.filter(p => p.category === "Technology").length },
  { name: "Recovery", icon: Activity, count: blogPosts.filter(p => p.category === "Recovery").length }
];

// Category styling config
const categoryConfig: Record<string, { icon: any; color: string; bgColor: string; borderColor: string }> = {
  "All": { icon: BookOpen, color: "text-primary", bgColor: "bg-primary/10", borderColor: "border-primary/20" },
  "Training Tips": { icon: Target, color: "text-emerald-400", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/20" },
  "Athlete Stories": { icon: Trophy, color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/20" },
  "Nutrition": { icon: Flame, color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/20" },
  "Mental Game": { icon: Star, color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/20" },
  "Technology": { icon: TrendingUp, color: "text-cyan-400", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/20" },
  "Recovery": { icon: Activity, color: "text-rose-400", bgColor: "bg-rose-500/10", borderColor: "border-rose-500/20" }
};

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);

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
  
  // Get trending post (first featured)
  const trendingPost = featuredPosts[0];

  return (
    <div className="min-h-screen bg-background">
      <BlogSEO />
      <Navbar />
      
      {/* Modern Hero Section */}
      <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <BookOpen className="h-4 w-4" />
                <span>Pakistan Sports Hub</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 tracking-tight">
                Pakistani Sports{' '}
                <span className="text-gradient">Stories</span>
              </h1>
              
              <p className="text-xl text-foreground-secondary max-w-xl mb-8 leading-relaxed">
                Expert cricket training tips, athlete journeys from Karachi to Lahore, and sports insights from across Pakistan. 
                Everything you need to elevate your game.
              </p>

              {/* Stats */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">50K+</p>
                    <p className="text-sm text-foreground-muted">Readers</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">200+</p>
                    <p className="text-sm text-foreground-muted">Articles</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Trending Card */}
            {trendingPost && (
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-50" />
                <Card className="relative overflow-hidden border-0 shadow-2xl">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={trendingPost.image} 
                      alt={trendingPost.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground font-semibold">
                        <Flame className="h-3 w-3 mr-1" />
                        Trending Now
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-primary text-sm font-medium mb-2">{trendingPost.category}</p>
                      <h3 className="text-2xl font-display font-bold text-white mb-2">
                        {trendingPost.title}
                      </h3>
                      <p className="text-white/80 text-sm line-clamp-2">
                        {trendingPost.excerpt}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sticky Search & Filter Bar */}
      <section className="sticky top-0 z-40 py-4 px-4 sm:px-6 lg:px-8 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search articles, topics, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base bg-card border-border/50 rounded-xl focus:border-primary"
              />
            </div>
            
            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => {
                const config = categoryConfig[category.name];
                const isActive = selectedCategory === category.name;
                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? `${config.bgColor} ${config.color} border ${config.borderColor} shadow-lg`
                        : "bg-card text-foreground-secondary hover:bg-card-hover border border-border/50"
                    }`}
                  >
                    <category.icon className="h-4 w-4" />
                    {category.name}
                    <span className={`px-2 py-0.5 rounded-lg text-xs ${
                      isActive ? "bg-current/20" : "bg-muted"
                    }`}>
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Grid */}
      {featuredPosts.length > 0 && selectedCategory === "All" && !searchQuery && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">Featured Stories</h2>
                  <p className="text-foreground-muted text-sm">Handpicked articles for you</p>
                </div>
              </div>
              <Button variant="outline" className="hidden sm:flex items-center gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <Card 
                  key={post.id} 
                  className={`group overflow-hidden border-border/50 bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 ${
                    index === 0 ? 'lg:row-span-2' : ''
                  }`}
                  onMouseEnter={() => setHoveredPost(post.id)}
                  onMouseLeave={() => setHoveredPost(null)}
                >
                  <div className={`relative overflow-hidden ${
                    index === 0 ? 'h-80 lg:h-96' : 'h-56'
                  }`}>
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge 
                        className={`${categoryConfig[post.category]?.bgColor || 'bg-primary/10'} ${categoryConfig[post.category]?.color || 'text-primary'} border-0 font-medium backdrop-blur-sm`}
                      >
                        {post.category}
                      </Badge>
                    </div>

                    {/* Read Time */}
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readTime}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className={`p-6 ${index === 0 ? 'lg:p-8' : ''}`}>
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-sm text-foreground-muted mb-3">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                    
                    <h3 className={`font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors ${
                      index === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'
                    }`}>
                      {post.title}
                    </h3>
                    
                    <p className={`text-foreground-secondary mb-6 ${index === 0 ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'}`}>
                      {post.excerpt}
                    </p>
                    
                    {/* Author & Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-card">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                            {post.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm text-foreground">{post.author.name}</p>
                          <p className="text-xs text-foreground-muted">{post.author.role}</p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="group/btn text-primary hover:text-primary hover:bg-primary/10"
                      >
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

      {/* All Posts - Modern Grid */}
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