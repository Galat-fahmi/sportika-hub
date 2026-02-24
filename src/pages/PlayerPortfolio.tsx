import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Trophy, 
  MapPin, 
  TrendingUp,
  Medal,
  Star,
  Share2,
  Mail,
  Instagram,
  Twitter,
  Globe,
  Calendar,
  Award,
  Target,
  Flag,
  ChevronLeft,
  Image as ImageIcon,
  Users,
  Briefcase,
  Heart,
  Shield,
  Zap,
  BarChart3,
  Clock,
  Building2,
  Phone,
  FileText
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
// import { useQuery } from "@tanstack/react-query";
// import { getPortfolioBySlug, getPortfolioSections, getPortfolioMedia, incrementPortfolioView } from "@/lib/athlete-portfolio-api";

interface Achievement {
  id: string;
  title: string;
  year: string;
  category: string;
  description?: string;
  icon: typeof Trophy;
}

interface GalleryImage {
  id: string;
  src: string;
  caption: string;
  category: string;
}

interface Stat {
  label: string;
  value: string | number;
  icon: typeof Trophy;
  description?: string;
}

interface Tournament {
  id: string;
  name: string;
  year: string;
  position: string;
  location: string;
  category: string;
}

interface TeamHistory {
  id: string;
  team: string;
  role: string;
  period: string;
  location: string;
  achievements: string;
}

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  validUntil?: string;
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  category: string;
}

interface Sponsorship {
  id: string;
  brand: string;
  logo: string;
  type: string;
  since: string;
}

interface ContactInfo {
  email: string;
  phone?: string;
  location: string;
  website?: string;
  agent?: string;
  agentEmail?: string;
  agentPhone?: string;
}

interface SocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  website?: string;
}

const PlayerPortfolio = () => {
  const { playername } = useParams<{ playername: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Comprehensive mock data for Pakistani athlete portfolios
  const mockPortfolios: Record<string, any> = {
    "babar-azam-cricket": {
      id: "1",
      fullName: "Babar Azam",
      title: "Babar Azam",
      profile_image_url: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face",
      cover_image_url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=400&fit=crop",
      sport: "Cricket",
      position: "Top-order Batsman",
      role: "Captain (Pakistan National Team)",
      country: "Pakistan",
      country_code: "PK",
      city: "Lahore",
      ranking: 1,
      ranking_tier: "elite" as const,
      bio: "Babar Azam is the captain of the Pakistan national cricket team and widely regarded as one of the finest batsmen in modern cricket. Known for his elegant batting style, impeccable timing, and consistency across all formats. He has broken numerous records and continues to inspire the next generation of Pakistani cricketers.",
      careerSummary: "Made international debut in 2015. Became Pakistan's T20I captain in 2019 and ODI captain in 2020. Currently ranked among the top batsmen in all three formats. Holds the record for fastest Pakistani batsman to reach 1000, 2000, 3000, 4000, and 5000 runs in ODIs.",
      dateOfBirth: "1995-10-15",
      height: "5'11\"",
      dominantHand: "Right-handed",
      languages: ["Urdu", "English", "Punjabi"],
      email: "contact@babarazam.pk",
      phone: "+92-300-XXXXXXX",
      location: "Lahore, Punjab, Pakistan",
      website: "www.babarazam.pk",
      agent: "Platinum Management",
      agentEmail: "bookings@platinummanagement.pk",
      agentPhone: "+92-42-XXXXXXX",
      social_links: {
        instagram: "@babarazam",
        twitter: "@babarazam258",
        facebook: "@babarazamofficial",
        youtube: "@babarazam",
        website: "www.babarazam.pk"
      },
      sports: ["Cricket"],
      specialties: ["Cover Drive", "Late Cut", "Captaincy", "Match Finishing"],
      views_count: 52450,
      is_verified: true,
      published_at: "2024-01-15T10:30:00Z",
      
      // Comprehensive Stats
      statistics: {
        test: { matches: 52, runs: 3772, average: 47.74, hundreds: 9, fifties: 26, highest: 196 },
        odi: { matches: 117, runs: 5729, average: 56.72, hundreds: 19, fifties: 32, highest: 158 },
        t20i: { matches: 109, runs: 3485, average: 41.48, strikeRate: 128.41, fifties: 30, highest: 122 },
        overall: { matches: 278, runs: 12986, wickets: 0, catches: 142, stumpings: 0 }
      },
      
      // Achievements & Awards
      achievements: [
        { id: "1", title: "ICC ODI Player of the Year", year: "2021", category: "ICC Award", description: "Recognized as the best ODI batsman globally", icon: Trophy },
        { id: "2", title: "PCB Player of the Year", year: "2020, 2021, 2022", category: "National Award", description: "Three consecutive years as Pakistan's best", icon: Award },
        { id: "3", title: "ICC World Test Championship Final", year: "2021", category: "Team Achievement", description: "Led Pakistan to WTC final", icon: Medal },
        { id: "4", title: "ICC T20 World Cup Semi-final", year: "2021, 2022", category: "Team Achievement", description: "Reached semi-finals in consecutive tournaments", icon: Trophy },
        { id: "5", title: "PSL Champion (Karachi Kings)", year: "2020", category: "League Title", description: "Captain of championship-winning team", icon: Star },
        { id: "6", title: "ICC Men's Cricketer of the Year", year: "2022", category: "ICC Award", description: "Highest individual honor in world cricket", icon: Trophy },
      ],
      
      // Tournament History
      tournaments: [
        { id: "1", name: "ICC Cricket World Cup", year: "2019, 2023", position: "Semi-finalist", location: "England, India", category: "World Cup" },
        { id: "2", name: "ICC T20 World Cup", year: "2021, 2022, 2024", position: "Semi-finalist", location: "UAE, Australia, USA", category: "World Cup" },
        { id: "3", name: "Asia Cup", year: "2018, 2022, 2023", position: "Champion (2023)", location: "UAE, Sri Lanka", category: "Continental" },
        { id: "4", name: "Pakistan Super League", year: "2017-2024", position: "Champion (2020)", location: "Pakistan/UAE", category: "Domestic T20" },
        { id: "5", name: "Test Series vs Australia", year: "2022", position: "Series Draw", location: "Pakistan", category: "Test Series" },
        { id: "6", name: "Test Series vs England", year: "2022", position: "Series Win", location: "Pakistan", category: "Test Series" },
      ],
      
      // Skills & Strengths
      skills: [
        { name: "Batting Technique", level: 98, category: "Technical" },
        { name: "Cover Drive", level: 100, category: "Technical" },
        { name: "Captaincy", level: 92, category: "Leadership" },
        { name: "Match Finishing", level: 95, category: "Mental" },
        { name: "Pressure Handling", level: 94, category: "Mental" },
        { name: "Fielding", level: 88, category: "Physical" },
        { name: "Fitness", level: 90, category: "Physical" },
        { name: "Team Management", level: 91, category: "Leadership" },
      ],
      
      // Team / Club History
      teamHistory: [
        { id: "1", team: "Pakistan National Team", role: "Captain & Batsman", period: "2015 - Present", location: "Pakistan", achievements: "ICC Awards, Series Wins" },
        { id: "2", team: "Karachi Kings (PSL)", role: "Captain", period: "2020 - Present", location: "Karachi", achievements: "PSL Champion 2020" },
        { id: "3", team: "Central Punjab", role: "Captain", period: "2019 - 2023", location: "Lahore", achievements: "Domestic Champion" },
        { id: "4", team: "Zalmi Cricket Academy", role: "Trainee", period: "2010 - 2015", location: "Lahore", achievements: "Youth Development" },
      ],
      
      // Training & Certifications
      certifications: [
        { id: "1", name: "ICC Anti-Corruption Certification", issuer: "International Cricket Council", year: "2019", validUntil: "2025" },
        { id: "2", name: "Sports Psychology Diploma", issuer: "Lahore University of Management Sciences", year: "2018" },
        { id: "3", name: "Advanced Batting Coaching", issuer: "PCB Coaching Academy", year: "2016" },
        { id: "4", name: "Fitness & Nutrition Certification", issuer: "Pakistan Sports Board", year: "2017" },
      ],
      
      // Videos / Highlights
      videos: [
        { id: "1", title: "Best Cover Drives Compilation 2023", thumbnail: "/api/placeholder/300/200", duration: "8:45", views: "2.5M", category: "Batting Highlights" },
        { id: "2", title: "Captain's Knock vs India - Asia Cup 2023", thumbnail: "/api/placeholder/300/200", duration: "12:30", views: "5.1M", category: "Match Highlights" },
        { id: "3", title: "Training Session: Net Practice", thumbnail: "/api/placeholder/300/200", duration: "15:20", views: "890K", category: "Training" },
        { id: "4", title: "Post-Match Interview - World Cup", thumbnail: "/api/placeholder/300/200", duration: "6:15", views: "1.2M", category: "Interview" },
        { id: "5", title: "PSL Winning Moment 2020", thumbnail: "/api/placeholder/300/200", duration: "4:30", views: "3.8M", category: "Tournament" },
        { id: "6", title: "Century vs Australia - Test Match", thumbnail: "/api/placeholder/300/200", duration: "18:45", views: "2.1M", category: "Match Highlights" },
      ],
      
      // Gallery
      gallery: [
        { id: "1", src: "/api/placeholder/400/400", caption: "Century Celebration vs England", category: "Match" },
        { id: "2", src: "/api/placeholder/400/400", caption: "PSL Trophy Lift 2020", category: "Tournament" },
        { id: "3", src: "/api/placeholder/400/400", caption: "Training at Gaddafi Stadium", category: "Training" },
        { id: "4", src: "/api/placeholder/400/400", caption: "ICC Award Ceremony 2021", category: "Awards" },
        { id: "5", src: "/api/placeholder/400/400", caption: "With Team Pakistan", category: "Team" },
        { id: "6", src: "/api/placeholder/400/400", caption: "Cover Drive Perfection", category: "Action" },
        { id: "7", src: "/api/placeholder/400/400", caption: "Fans Meet & Greet", category: "Community" },
        { id: "8", src: "/api/placeholder/400/400", caption: "Captain's Press Conference", category: "Media" },
      ],
      
      // Sponsorships / Endorsements
      sponsorships: [
        { id: "1", brand: "Gray-Nicolls", logo: "/api/placeholder/100/50", type: "Equipment Sponsor", since: "2018" },
        { id: "2", brand: "HBL Pakistan", logo: "/api/placeholder/100/50", type: "Brand Ambassador", since: "2019" },
        { id: "3", brand: "OPPO Pakistan", logo: "/api/placeholder/100/50", type: "Brand Ambassador", since: "2020" },
        { id: "4", brand: "Jazz Pakistan", logo: "/api/placeholder/100/50", type: "Brand Ambassador", since: "2021" },
        { id: "5", brand: "Pepsi Pakistan", logo: "/api/placeholder/100/50", type: "Brand Ambassador", since: "2022" },
      ],
    },
    
    "shaheen-afridi-cricket": {
      id: "2",
      fullName: "Shaheen Shah Afridi",
      title: "Shaheen Afridi",
      profile_image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
      cover_image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop",
      sport: "Cricket",
      position: "Left-arm Fast Bowler",
      role: "Strike Bowler",
      country: "Pakistan",
      country_code: "PK",
      city: "Landi Kotal, KPK",
      ranking: 2,
      ranking_tier: "elite" as const,
      bio: "Shaheen Afridi is Pakistan's premier fast bowler known for his lethal swing bowling and ability to take wickets in crucial moments. At 6'6\", he generates steep bounce and has become one of the most feared bowlers in world cricket across all formats.",
      careerSummary: "International debut in 2018. Youngest Pakistani bowler to take a five-wicket haul in Tests. Known for devastating opening spells and ability to bowl long spells. Key member of Pakistan's bowling attack across all formats.",
      dateOfBirth: "2000-04-06",
      height: "6'6\"",
      dominantHand: "Left-handed",
      languages: ["Pashto", "Urdu", "English"],
      email: "shaheen@afridi.pk",
      phone: "+92-333-XXXXXXX",
      location: "Landi Kotal, Khyber Pakhtunkhwa, Pakistan",
      website: "www.shaheenafridi.pk",
      agent: "Saya Corporation",
      agentEmail: "contact@saya.pk",
      social_links: {
        instagram: "@ishaheenafridi",
        twitter: "@iShaheenAfridi",
        facebook: "@shaheenafridiofficial",
      },
      sports: ["Cricket"],
      specialties: ["Swing Bowling", "Yorkers", "New Ball Bowling", "Death Overs"],
      views_count: 46890,
      is_verified: true,
      published_at: "2024-01-10T09:15:00Z",
      
      statistics: {
        test: { matches: 29, wickets: 105, average: 25.44, bestBowling: "6/51", fiveWickets: 4 },
        odi: { matches: 53, wickets: 104, average: 23.94, economy: 5.52, bestBowling: "6/35" },
        t20i: { matches: 52, wickets: 64, average: 22.73, economy: 7.72 },
        overall: { matches: 134, wickets: 273, bestFigures: "6/35", catches: 21 }
      },
      
      achievements: [
        { id: "1", title: "ICC Cricketer of the Year", year: "2021", category: "ICC Award", description: "Best overall performance globally", icon: Trophy },
        { id: "2", title: "ICC Test Team of the Year", year: "2021, 2022", category: "ICC Recognition", description: "Selected as best Test bowler", icon: Award },
        { id: "3", title: "PSL Best Bowler", year: "2022", category: "League Award", description: "Most wickets in PSL season", icon: Medal },
        { id: "4", title: "T20 World Cup Final Hero", year: "2022", category: "Match Performance", description: "3/31 in final vs England", icon: Star },
      ],
      
      tournaments: [
        { id: "1", name: "ICC T20 World Cup", year: "2021, 2022, 2024", position: "Finalist (2022)", location: "Multiple", category: "World Cup" },
        { id: "2", name: "Asia Cup", year: "2018, 2022, 2023", position: "Champion (2023)", location: "UAE, Sri Lanka", category: "Continental" },
        { id: "3", name: "Pakistan Super League", year: "2018-2024", position: "Champion (2022)", location: "Pakistan", category: "Domestic T20" },
        { id: "4", name: "County Championship", year: "2022", position: "Player", location: "England", category: "County Cricket" },
      ],
      
      skills: [
        { name: "Swing Bowling", level: 98, category: "Technical" },
        { name: "Yorker Delivery", level: 95, category: "Technical" },
        { name: "New Ball Bowling", level: 97, category: "Technical" },
        { name: "Death Bowling", level: 92, category: "Technical" },
        { name: "Bounce Extraction", level: 96, category: "Physical" },
        { name: "Stamina", level: 94, category: "Physical" },
        { name: "Pressure Handling", level: 93, category: "Mental" },
      ],
      
      teamHistory: [
        { id: "1", team: "Pakistan National Team", role: "Strike Bowler", period: "2018 - Present", location: "Pakistan", achievements: "ICC Awards, World Cup Final" },
        { id: "2", team: "Lahore Qalandars (PSL)", role: "Lead Bowler", period: "2018 - Present", location: "Lahore", achievements: "PSL Champion 2022, 2023" },
        { id: "3", team: "Hampshire CCC", role: "Overseas Player", period: "2022", location: "England", achievements: "County Championship" },
        { id: "4", team: "KPK Province", role: "Lead Bowler", period: "2017 - Present", location: "Peshawar", achievements: "Domestic Titles" },
      ],
      
      certifications: [
        { id: "1", name: "ICC Anti-Corruption Certification", issuer: "International Cricket Council", year: "2018", validUntil: "2024" },
        { id: "2", name: "Fast Bowling Biomechanics", issuer: "PCB High Performance", year: "2019" },
        { id: "3", name: "Sports Injury Prevention", issuer: "Pakistan Sports Board", year: "2020" },
      ],
      
      videos: [
        { id: "1", title: "First Over Wickets Compilation", thumbnail: "/api/placeholder/300/200", duration: "6:30", views: "3.2M", category: "Bowling Highlights" },
        { id: "2", title: "T20 World Cup Final Spell", thumbnail: "/api/placeholder/300/200", duration: "4:15", views: "4.8M", category: "Match Highlights" },
        { id: "3", title: "Yorker Masterclass", thumbnail: "/api/placeholder/300/200", duration: "10:00", views: "1.5M", category: "Tutorial" },
      ],
      
      gallery: [
        { id: "1", src: "/api/placeholder/400/400", caption: "Wicket Celebration", category: "Match" },
        { id: "2", src: "/api/placeholder/400/400", caption: "PSL Trophy 2022", category: "Tournament" },
        { id: "3", src: "/api/placeholder/400/400", caption: "Training at NCA", category: "Training" },
        { id: "4", src: "/api/placeholder/400/400", caption: "ICC Award 2021", category: "Awards" },
      ],
      
      sponsorships: [
        { id: "1", brand: "Gray-Nicolls", logo: "/api/placeholder/100/50", type: "Equipment Sponsor", since: "2019" },
        { id: "2", brand: "Jazz Pakistan", logo: "/api/placeholder/100/50", type: "Brand Ambassador", since: "2021" },
        { id: "3", brand: "Gatorade Pakistan", logo: "/api/placeholder/100/50", type: "Brand Ambassador", since: "2022" },
      ],
    },
    
    // FOOTBALL - Hassan Ali
    "hassan-ali-football": {
      id: "3",
      fullName: "Hassan Ali",
      title: "Hassan Ali",
      profile_image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
      cover_image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
      sport: "Football",
      position: "Striker / Forward",
      role: "Captain (Pakistan National Team)",
      country: "Pakistan",
      country_code: "PK",
      city: "Lahore",
      ranking: 1,
      ranking_tier: "elite" as const,
      bio: "Hassan Ali is Pakistan's premier football striker and captain of the national team. Known for his explosive pace, clinical finishing, and exceptional aerial ability. He has been instrumental in reviving football culture in Pakistan and inspiring the next generation of players.",
      careerSummary: "Made international debut in 2018. Became national team captain in 2022. Top scorer in Pakistan Premier League for three consecutive seasons. First Pakistani player to score in AFC Cup competition.",
      dateOfBirth: "1996-03-15",
      height: "6'0\"",
      dominantHand: "Right-footed",
      languages: ["Urdu", "English", "Punjabi"],
      email: "hassan.ali@football.pk",
      phone: "+92-321-XXXXXXX",
      location: "Lahore, Punjab, Pakistan",
      website: "www.hassanalifootball.pk",
      agent: "Elite Sports Management",
      agentEmail: "bookings@elitesports.pk",
      agentPhone: "+92-42-XXXXXXX",
      social_links: {
        instagram: "@hassanali10",
        twitter: "@hassanali_football",
        facebook: "@hassanaliofficial",
        youtube: "@hassanali10",
      },
      sports: ["Football"],
      specialties: ["Finishing", "Aerial Duels", "Pace", "Leadership", "Free Kicks"],
      views_count: 32150,
      is_verified: true,
      published_at: "2024-01-20T10:30:00Z",
      
      statistics: {
        international: { matches: 48, goals: 23, assists: 12, caps: 48 },
        league: { matches: 156, goals: 89, assists: 34, season: "2023-24" },
        continental: { matches: 12, goals: 5, assists: 3, tournaments: 3 },
        overall: { matches: 216, goals: 117, assists: 49, cleanSheets: 0 }
      },
      
      achievements: [
        { id: "1", title: "Pakistan Premier League Top Scorer", year: "2021, 2022, 2023", category: "Domestic Award", description: "Three consecutive golden boot awards", icon: Trophy },
        { id: "2", title: "PFF Player of the Year", year: "2022, 2023", category: "National Award", description: "Best footballer in Pakistan", icon: Award },
        { id: "3", title: "SAFF Championship Semi-final", year: "2023", category: "Team Achievement", description: "Led Pakistan to semi-finals", icon: Medal },
        { id: "4", title: "AFC Cup Goal Scorer", year: "2022", category: "Continental", description: "First Pakistani to score in AFC Cup", icon: Star },
        { id: "5", title: "Pakistan Premier League Champion", year: "2022, 2023", category: "League Title", description: "Back-to-back championships with WAPDA", icon: Trophy },
      ],
      
      tournaments: [
        { id: "1", name: "FIFA World Cup Qualifiers", year: "2022, 2026", position: "Group Stage", location: "Multiple", category: "World Cup" },
        { id: "2", name: "SAFF Championship", year: "2021, 2023", position: "Semi-finalist (2023)", location: "South Asia", category: "Continental" },
        { id: "3", name: "AFC Asian Cup Qualifiers", year: "2023", position: "Qualifying Round", location: "Multiple", category: "Continental" },
        { id: "4", name: "Pakistan Premier League", year: "2019-2024", position: "Champion (2022, 2023)", location: "Pakistan", category: "Domestic" },
        { id: "5", name: "National Challenge Cup", year: "2020-2024", position: "Champion (2021, 2023)", location: "Pakistan", category: "Domestic Cup" },
      ],
      
      skills: [
        { name: "Finishing", level: 95, category: "Technical" },
        { name: "Heading", level: 92, category: "Technical" },
        { name: "Dribbling", level: 88, category: "Technical" },
        { name: "Free Kicks", level: 85, category: "Technical" },
        { name: "Pace", level: 94, category: "Physical" },
        { name: "Strength", level: 87, category: "Physical" },
        { name: "Game Intelligence", level: 90, category: "Mental" },
        { name: "Captaincy", level: 88, category: "Leadership" },
      ],
      
      teamHistory: [
        { id: "1", team: "Pakistan National Team", role: "Captain & Striker", period: "2018 - Present", location: "Pakistan", achievements: "National Team Captain" },
        { id: "2", team: "WAPDA FC", role: "Striker", period: "2019 - Present", location: "Lahore", achievements: "PPL Champion 2022, 2023" },
        { id: "3", team: "K-Electric FC", role: "Forward", period: "2017 - 2019", location: "Karachi", achievements: "Youth Development" },
        { id: "4", team: "Lahore Youth Academy", role: "Trainee", period: "2012 - 2017", location: "Lahore", achievements: "Youth National Champion" },
      ],
      
      certifications: [
        { id: "1", name: "AFC Coaching License B", issuer: "Asian Football Confederation", year: "2023" },
        { id: "2", name: "FIFA Anti-Doping Certification", issuer: "FIFA", year: "2020", validUntil: "2025" },
        { id: "3", name: "Sports Nutrition for Football", issuer: "Pakistan Football Federation", year: "2019" },
      ],
      
      videos: [
        { id: "1", title: "Best Goals Compilation 2023", thumbnail: "/api/placeholder/300/200", duration: "10:30", views: "1.8M", category: "Goals" },
        { id: "2", title: "Free Kick Masterclass", thumbnail: "/api/placeholder/300/200", duration: "5:45", views: "890K", category: "Skills" },
        { id: "3", title: "AFC Cup Debut Goal", thumbnail: "/api/placeholder/300/200", duration: "2:15", views: "2.1M", category: "Match Highlights" },
      ],
      
      gallery: [
        { id: "1", src: "/api/placeholder/400/400", caption: "Goal Celebration vs India", category: "Match" },
        { id: "2", src: "/api/placeholder/400/400", caption: "PPL Trophy Lift 2023", category: "Tournament" },
        { id: "3", src: "/api/placeholder/400/400", caption: "Training at Punjab Stadium", category: "Training" },
        { id: "4", src: "/api/placeholder/400/400", caption: "PFF Award Ceremony", category: "Awards" },
      ],
      
      sponsorships: [
        { id: "1", brand: "Adidas Pakistan", logo: "/api/placeholder/100/50", type: "Kit Sponsor", since: "2020" },
        { id: "2", brand: "Jazz Pakistan", logo: "/api/placeholder/100/50", type: "Brand Ambassador", since: "2022" },
        { id: "3", brand: "Gatorade", logo: "/api/placeholder/100/50", type: "Brand Ambassador", since: "2021" },
      ],
    },

    // BASKETBALL - Muhammad Shahzad
    "muhammad-shahzad-basketball": {
      id: "4",
      fullName: "Muhammad Shahzad",
      title: "Muhammad Shahzad",
      profile_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      cover_image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop",
      sport: "Basketball",
      position: "Point Guard",
      role: "Captain (Pakistan National Team)",
      country: "Pakistan",
      country_code: "PK",
      city: "Islamabad",
      ranking: 1,
      ranking_tier: "elite" as const,
      bio: "Muhammad Shahzad is Pakistan's top basketball talent and captain of the national team. Standing at 6'3\", he combines exceptional court vision with lightning-fast ball handling. He has been pivotal in promoting basketball across Pakistan and has represented the country in multiple international competitions.",
      careerSummary: "Started playing professionally in 2016. Became national team captain in 2021. Three-time Pakistan Basketball League champion. First Pakistani player to receive NCAA Division II scholarship offer.",
      dateOfBirth: "1995-07-22",
      height: "6'3\"",
      dominantHand: "Right-handed",
      languages: ["Urdu", "English"],
      email: "shahzad.basketball@pk.com",
      phone: "+92-333-XXXXXXX",
      location: "Islamabad, Pakistan",
      website: "www.mshahzadbasketball.com",
      agent: "ProBall Sports Agency",
      agentEmail: "contact@proball.pk",
      social_links: {
        instagram: "@shahzad_bball",
        twitter: "@mshahzad_basketball",
        facebook: "@muhammadshahzadbasketball",
      },
      sports: ["Basketball"],
      specialties: ["Ball Handling", "Three-Point Shooting", "Court Vision", "Leadership", "Fast Break"],
      views_count: 28450,
      is_verified: true,
      published_at: "2024-02-01T09:00:00Z",
      
      statistics: {
        international: { matches: 42, points: 756, assists: 312, rebounds: 189 },
        league: { matches: 128, points: 2847, assists: 892, rebounds: 534 },
        continental: { matches: 18, points: 324, assists: 156, rebounds: 98 },
        overall: { matches: 188, points: 3927, assists: 1360, rebounds: 821 }
      },
      
      achievements: [
        { id: "1", title: "Pakistan Basketball League MVP", year: "2021, 2022, 2023", category: "Domestic Award", description: "Three-time league MVP", icon: Trophy },
        { id: "2", title: "PBF Player of the Year", year: "2022, 2023", category: "National Award", description: "Best basketball player in Pakistan", icon: Award },
        { id: "3", title: "South Asian Games Bronze", year: "2019", category: "Team Achievement", description: "Bronze medal with national team", icon: Medal },
        { id: "4", title: "FIBA Asia Cup Qualifiers", year: "2022", category: "Continental", description: "Team captain in qualifiers", icon: Star },
        { id: "5", title: "PBL Champion", year: "2019, 2021, 2022", category: "League Title", description: "Three championships with Army", icon: Trophy },
      ],
      
      tournaments: [
        { id: "1", name: "FIBA Basketball World Cup Qualifiers", year: "2023", position: "Qualifying Round", location: "Multiple", category: "World Cup" },
        { id: "2", name: "FIBA Asia Cup", year: "2022", position: "Group Stage", location: "Indonesia", category: "Continental" },
        { id: "3", name: "South Asian Games", year: "2019", position: "Bronze Medal", location: "Nepal", category: "Regional" },
        { id: "4", name: "Pakistan Basketball League", year: "2018-2024", position: "Champion (2019, 2021, 2022)", location: "Pakistan", category: "Domestic" },
        { id: "5", name: "National Basketball Championship", year: "2017-2024", position: "Champion (2020, 2022, 2023)", location: "Pakistan", category: "Domestic" },
      ],
      
      skills: [
        { name: "Ball Handling", level: 96, category: "Technical" },
        { name: "Three-Point Shooting", level: 92, category: "Technical" },
        { name: "Passing", level: 94, category: "Technical" },
        { name: "Court Vision", level: 95, category: "Mental" },
        { name: "Speed", level: 91, category: "Physical" },
        { name: "Agility", level: 93, category: "Physical" },
        { name: "Game Management", level: 90, category: "Leadership" },
      ],
      
      teamHistory: [
        { id: "1", team: "Pakistan National Team", role: "Captain & Point Guard", period: "2018 - Present", location: "Pakistan", achievements: "National Team Captain" },
        { id: "2", team: "Pakistan Army", role: "Point Guard", period: "2017 - Present", location: "Rawalpindi", achievements: "PBL Champion 2019, 2021, 2022" },
        { id: "3", team: "LUMS Basketball", role: "Guard", period: "2013 - 2017", location: "Lahore", achievements: "University Champion" },
        { id: "4", team: "Islamabad Basketball Academy", role: "Trainee", period: "2008 - 2013", location: "Islamabad", achievements: "Youth Development" },
      ],
      
      certifications: [
        { id: "1", name: "FIBA Coaching License", issuer: "FIBA", year: "2022" },
        { id: "2", name: "FIBA Anti-Doping Certification", issuer: "FIBA", year: "2019", validUntil: "2024" },
        { id: "3", name: "Sports Psychology", issuer: "Pakistan Sports Board", year: "2020" },
      ],
      
      videos: [
        { id: "1", title: "Best Assists Compilation", thumbnail: "/api/placeholder/300/200", duration: "8:20", views: "1.2M", category: "Highlights" },
        { id: "2", title: "Three-Point Shooting Drill", thumbnail: "/api/placeholder/300/200", duration: "6:45", views: "750K", category: "Training" },
        { id: "3", title: "FIBA Asia Cup Highlights", thumbnail: "/api/placeholder/300/200", duration: "4:30", views: "1.5M", category: "Match Highlights" },
      ],
      
      gallery: [
        { id: "1", src: "/api/placeholder/400/400", caption: "Game Winning Shot", category: "Match" },
        { id: "2", src: "/api/placeholder/400/400", caption: "PBL Trophy 2022", category: "Tournament" },
        { id: "3", src: "/api/placeholder/400/400", caption: "Training Session", category: "Training" },
        { id: "4", src: "/api/placeholder/400/400", caption: "PBF Awards", category: "Awards" },
      ],
      
      sponsorships: [
        { id: "1", brand: "Nike Pakistan", logo: "/api/placeholder/100/50", type: "Kit Sponsor", since: "2020" },
        { id: "2", brand: "Gatorade", logo: "/api/placeholder/100/50", type: "Brand Ambassador", since: "2021" },
        { id: "3", brand: "Jazz Pakistan", logo: "/api/placeholder/100/50", type: "Brand Ambassador", since: "2022" },
      ],
    },

    // ATHLETICS - Nadia Nazir
    "nadia-nazir-athletics": {
      id: "5",
      fullName: "Nadia Nazir",
      title: "Nadia Nazir",
      profile_image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      cover_image_url: "https://images.unsplash.com/photo-1461896836934-00ba6d2a6a5e?w=800&h=400&fit=crop",
      sport: "Athletics",
      position: "100m & 200m Sprinter",
      role: "National Record Holder",
      country: "Pakistan",
      country_code: "PK",
      city: "Rawalpindi",
      ranking: 1,
      ranking_tier: "elite" as const,
      bio: "Nadia Nazir is Pakistan's fastest female sprinter and national record holder in both 100m and 200m events. Her explosive starts and powerful finishing have made her a dominant force in South Asian athletics. She is a role model for female athletes across Pakistan.",
      careerSummary: "Started competitive athletics in 2015. Broke national 100m record in 2019. First Pakistani female sprinter to qualify for Asian Championships final. Multiple gold medals at South Asian Games.",
      dateOfBirth: "1998-11-08",
      height: "5'7\"",
      dominantHand: "Right-handed",
      languages: ["Urdu", "English", "Punjabi"],
      email: "nadia.nazir@athletics.pk",
      phone: "+92-345-XXXXXXX",
      location: "Rawalpindi, Punjab, Pakistan",
      website: "www.nadianazir.pk",
      agent: "Speed Sports Management",
      agentEmail: "bookings@speedsports.pk",
      social_links: {
        instagram: "@nadianazir_sprinter",
        twitter: "@nadianazir",
        facebook: "@nadianazirofficial",
      },
      sports: ["Athletics"],
      specialties: ["100m Sprint", "200m Sprint", "Explosive Start", "Speed Endurance"],
      views_count: 25680,
      is_verified: true,
      published_at: "2024-01-25T14:00:00Z",
      
      statistics: {
        sprints: { events: 87, gold: 42, silver: 23, bronze: 12 },
        records: { national100m: "11.45s", national200m: "23.78s", personalBest100m: "11.45s", personalBest200m: "23.78s" },
        international: { competitions: 24, medals: 8, finals: 12 },
        overall: { matches: 87, wins: 42, podiums: 77, records: 2 }
      },
      
      achievements: [
        { id: "1", title: "National Record Holder (100m)", year: "2019 - Present", category: "National Record", description: "Fastest Pakistani woman 100m", icon: Trophy },
        { id: "2", title: "National Record Holder (200m)", year: "2020 - Present", category: "National Record", description: "Fastest Pakistani woman 200m", icon: Trophy },
        { id: "3", title: "South Asian Games Gold", year: "2019", category: "Regional", description: "Gold in 100m and 200m", icon: Medal },
        { id: "4", title: "Asian Championships Finalist", year: "2023", category: "Continental", description: "First Pakistani female in final", icon: Star },
        { id: "5", title: "Pakistan Athlete of the Year", year: "2020, 2022", category: "National Award", description: "Best female athlete in Pakistan", icon: Award },
      ],
      
      tournaments: [
        { id: "1", name: "Asian Athletics Championships", year: "2019, 2023", position: "Finalist (2023)", location: "Multiple", category: "Continental" },
        { id: "2", name: "South Asian Games", year: "2019", position: "Gold Medalist", location: "Nepal", category: "Regional" },
        { id: "3", name: "National Athletics Championships", year: "2016-2024", position: "Champion (2018-2024)", location: "Pakistan", category: "Domestic" },
        { id: "4", name: "Pakistan Open Athletics", year: "2017-2024", position: "Champion", location: "Pakistan", category: "Domestic" },
        { id: "5", name: "Islamic Solidarity Games", year: "2022", position: "Semi-finalist", location: "Turkey", category: "International" },
      ],
      
      skills: [
        { name: "Starting Blocks", level: 96, category: "Technical" },
        { name: "Sprint Technique", level: 94, category: "Technical" },
        { name: "Speed Endurance", level: 92, category: "Physical" },
        { name: "Explosive Power", level: 95, category: "Physical" },
        { name: "Race Strategy", level: 90, category: "Mental" },
        { name: "Mental Toughness", level: 93, category: "Mental" },
      ],
      
      teamHistory: [
        { id: "1", team: "Pakistan National Team", role: "Lead Sprinter", period: "2017 - Present", location: "Pakistan", achievements: "National Record Holder" },
        { id: "2", team: "WAPDA Athletics", role: "Sprinter", period: "2016 - Present", location: "Lahore", achievements: "National Champion" },
        { id: "3", team: "Pakistan Army Athletics", role: "Trainee", period: "2014 - 2016", location: "Rawalpindi", achievements: "Youth Champion" },
      ],
      
      certifications: [
        { id: "1", name: "IAAF Coaching Certification", issuer: "World Athletics", year: "2022" },
        { id: "2", name: "Sports Nutrition Specialist", issuer: "Pakistan Sports Board", year: "2020" },
        { id: "3", name: "Anti-Doping Education", issuer: "WADA", year: "2019", validUntil: "2025" },
      ],
      
      videos: [
        { id: "1", title: "National Record 100m - 11.45s", thumbnail: "/api/placeholder/300/200", duration: "0:15", views: "3.2M", category: "Record" },
        { id: "2", title: "Training: Block Starts", thumbnail: "/api/placeholder/300/200", duration: "7:30", views: "980K", category: "Training" },
        { id: "3", title: "South Asian Games Gold Race", thumbnail: "/api/placeholder/300/200", duration: "0:25", views: "2.1M", category: "Competition" },
      ],
      
      gallery: [
        { id: "1", src: "/api/placeholder/400/400", caption: "National Record Race", category: "Competition" },
        { id: "2", src: "/api/placeholder/400/400", caption: "South Asian Games Gold", category: "Awards" },
        { id: "3", src: "/api/placeholder/400/400", caption: "Training at PMA", category: "Training" },
        { id: "4", src: "/api/placeholder/400/400", caption: "Victory Celebration", category: "Competition" },
      ],
      
      sponsorships: [
        { id: "1", brand: "Nike Pakistan", logo: "/api/placeholder/100/50", type: "Equipment Sponsor", since: "2020" },
        { id: "2", brand: "Gatorade", logo: "/api/placeholder/100/50", type: "Brand Ambassador", since: "2021" },
        { id: "3", brand: "Pepsi Pakistan", logo: "/api/placeholder/100/50", type: "Brand Ambassador", since: "2022" },
      ],
    },

    // BADMINTON - Ahsan Mehsood
    "ahsan-mehsood-badminton": {
      id: "6",
      fullName: "Ahsan Mehsood",
      title: "Ahsan Mehsood",
      profile_image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      cover_image_url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=400&fit=crop",
      sport: "Badminton",
      position: "Singles & Doubles",
      role: "Pakistan No. 1",
      country: "Pakistan",
      country_code: "PK",
      city: "Peshawar",
      ranking: 1,
      ranking_tier: "elite" as const,
      bio: "Ahsan Mehsood is Pakistan's top-ranked badminton player and a dominant force in South Asian badminton. Known for his powerful smashes and exceptional net play, he has brought international recognition to Pakistani badminton. He competes in both singles and doubles events.",
      careerSummary: "Started playing professionally in 2014. Became Pakistan No. 1 in 2018. Multiple South Asian Games medalist. First Pakistani to reach BWF International Challenge final.",
      dateOfBirth: "1994-05-12",
      height: "5'10\"",
      dominantHand: "Right-handed",
      languages: ["Urdu", "English", "Pashto"],
      email: "ahsan.mehsood@badminton.pk",
      phone: "+92-333-XXXXXXX",
      location: "Peshawar, Khyber Pakhtunkhwa, Pakistan",
      website: "www.ahsanmehsood.pk",
      agent: "Shuttle Sports Management",
      agentEmail: "contact@shuttlesports.pk",
      social_links: {
        instagram: "@ahsanmehsood",
        twitter: "@ahsanmehsood",
        facebook: "@ahsanmehsoodofficial",
      },
      sports: ["Badminton"],
      specialties: ["Smash", "Net Play", "Footwork", "Defensive Play", "Doubles Strategy"],
      views_count: 22340,
      is_verified: true,
      published_at: "2024-02-10T11:00:00Z",
      
      statistics: {
        singles: { matches: 156, wins: 98, losses: 58, winRate: "62.8%" },
        doubles: { matches: 89, wins: 52, losses: 37, winRate: "58.4%" },
        international: { tournaments: 34, titles: 6, finals: 12 },
        overall: { matches: 245, wins: 150, losses: 95, titles: 6 }
      },
      
      achievements: [
        { id: "1", title: "Pakistan No. 1 Ranking", year: "2018 - Present", category: "National Ranking", description: "Top-ranked Pakistani player", icon: Trophy },
        { id: "2", title: "South Asian Games Silver", year: "2019", category: "Regional", description: "Silver in men's singles", icon: Medal },
        { id: "3", title: "South Asian Games Bronze", year: "2019", category: "Regional", description: "Bronze in men's doubles", icon: Medal },
        { id: "4", title: "BWF International Challenge Final", year: "2022", category: "International", description: "First Pakistani in final", icon: Star },
        { id: "5", title: "Pakistan National Champion", year: "2018, 2019, 2021, 2022, 2023", category: "Domestic", description: "Five-time national champion", icon: Trophy },
      ],
      
      tournaments: [
        { id: "1", name: "BWF World Championships", year: "2019, 2021, 2023", position: "Group Stage", location: "Multiple", category: "World" },
        { id: "2", name: "BWF International Challenge", year: "2019-2024", position: "Finalist (2022)", location: "Multiple", category: "International" },
        { id: "3", name: "South Asian Games", year: "2019", position: "Silver & Bronze", location: "Nepal", category: "Regional" },
        { id: "4", name: "Pakistan National Championships", year: "2015-2024", position: "Champion (5 times)", location: "Pakistan", category: "Domestic" },
        { id: "5", name: "Asian Badminton Championships", year: "2019, 2022, 2023", position: "Round of 16", location: "Multiple", category: "Continental" },
      ],
      
      skills: [
        { name: "Smash", level: 95, category: "Technical" },
        { name: "Net Play", level: 93, category: "Technical" },
        { name: "Footwork", level: 94, category: "Technical" },
        { name: "Defensive Play", level: 89, category: "Technical" },
        { name: "Agility", level: 92, category: "Physical" },
        { name: "Stamina", level: 90, category: "Physical" },
        { name: "Tactical Awareness", level: 91, category: "Mental" },
      ],
      
      teamHistory: [
        { id: "1", team: "Pakistan National Team", role: "No. 1 Player", period: "2017 - Present", location: "Pakistan", achievements: "National No. 1 Ranking" },
        { id: "2", team: "WAPDA Badminton", role: "Singles & Doubles", period: "2016 - Present", location: "Lahore", achievements: "National Champion" },
        { id: "3", team: "Peshawar Badminton Academy", role: "Trainee", period: "2008 - 2014", location: "Peshawar", achievements: "Youth Development" },
      ],
      
      certifications: [
        { id: "1", name: "BWF Coaching Certification", issuer: "Badminton World Federation", year: "2021" },
        { id: "2", name: "BWF Anti-Doping Certification", issuer: "BWF", year: "2018", validUntil: "2024" },
        { id: "3", name: "Sports Physiotherapy", issuer: "Pakistan Sports Board", year: "2019" },
      ],
      
      videos: [
        { id: "1", title: "Best Smashes Compilation", thumbnail: "/api/placeholder/300/200", duration: "6:45", views: "1.1M", category: "Highlights" },
        { id: "2", title: "Footwork Training", thumbnail: "/api/placeholder/300/200", duration: "9:20", views: "680K", category: "Training" },
        { id: "3", title: "South Asian Games Final", thumbnail: "/api/placeholder/300/200", duration: "12:30", views: "1.8M", category: "Match" },
      ],
      
      gallery: [
        { id: "1", src: "/api/placeholder/400/400", caption: "South Asian Games Silver", category: "Awards" },
        { id: "2", src: "/api/placeholder/400/400", caption: "National Championship Win", category: "Tournament" },
        { id: "3", src: "/api/placeholder/400/400", caption: "Training Session", category: "Training" },
        { id: "4", src: "/api/placeholder/400/400", caption: "BWF International Challenge", category: "Competition" },
      ],
      
      sponsorships: [
        { id: "1", brand: "Yonex Pakistan", logo: "/api/placeholder/100/50", type: "Equipment Sponsor", since: "2019" },
        { id: "2", brand: "Li-Ning", logo: "/api/placeholder/100/50", type: "Kit Sponsor", since: "2021" },
        { id: "3", brand: "Gatorade", logo: "/api/placeholder/100/50", type: "Brand Ambassador", since: "2022" },
      ],
    },

    "default": {
      id: "0",
      fullName: "Sample Athlete",
      title: "Sample Athlete",
      profile_image_url: "/api/placeholder/224/224",
      cover_image_url: "/api/placeholder/800/300",
      sport: "Sport",
      position: "Player",
      role: "Athlete",
      country: "Pakistan",
      country_code: "PK",
      city: "Karachi",
      ranking: 0,
      ranking_tier: "pro" as const,
      bio: "This is a sample athlete portfolio showcasing all features available on Sportika Pakistan.",
      careerSummary: "Professional athlete representing Pakistan in international competitions.",
      dateOfBirth: "1995-01-01",
      height: "5'10\"",
      dominantHand: "Right-handed",
      languages: ["Urdu", "English"],
      email: "contact@athlete.pk",
      phone: "+92-300-XXXXXXX",
      location: "Karachi, Pakistan",
      website: "www.athlete.pk",
      social_links: {
        instagram: "@athlete",
        twitter: "@athlete",
        website: "www.athlete.pk"
      },
      sports: ["Sport"],
      specialties: ["Skill 1", "Skill 2", "Skill 3"],
      views_count: 0,
      is_verified: false,
      published_at: null,
      
      statistics: { overall: { matches: 0, runs: 0, wickets: 0, catches: 0 } },
      achievements: [],
      tournaments: [],
      skills: [],
      teamHistory: [],
      certifications: [],
      videos: [],
      gallery: [],
      sponsorships: [],
    }
  };
  
  // Use mock data based on slug
  const portfolio = mockPortfolios[playername || "default"];
  
  // Use portfolio's own gallery data or fallback
  const portfolioMedia = portfolio?.gallery || [];
  
  // Simulate portfolio view increment
  useEffect(() => {
    if (portfolio?.id) {
      // In real implementation, this would call incrementPortfolioView
      console.log(`Portfolio view incremented for ${portfolio.id}`);
    }
  }, [portfolio?.id]);
  
  // Mock loading state
  const [isLoadingState, setIsLoadingState] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingState(false);
    }, 800); // Simulate API loading
    return () => clearTimeout(timer);
  }, [playername]);
  
  // If loading or no portfolio found
  if (isLoadingState) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading athlete portfolio...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!portfolio) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Portfolio Not Found</h1>
            <p className="text-muted-foreground mb-6">The athlete portfolio you're looking for doesn't exist or is not publicly available.</p>
            <Link to="/players" className="inline-flex items-center gap-2 text-primary hover:underline">
              <ChevronLeft className="h-4 w-4" />
              Back to Players
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Map portfolio to comprehensive player object
  const player = {
    id: portfolio.id,
    fullName: portfolio.fullName || portfolio.title,
    name: portfolio.title,
    photo: portfolio.profile_image_url || '',
    cover: portfolio.cover_image_url || '',
    sport: portfolio.sport || (portfolio.sports && portfolio.sports.length > 0 ? portfolio.sports[0] : 'Athlete'),
    position: portfolio.position || 'Player',
    role: portfolio.role || 'Athlete',
    country: portfolio.country || 'Pakistan',
    countryCode: portfolio.country_code || 'PK',
    city: portfolio.city || '',
    ranking: portfolio.ranking || 0,
    rankingTier: portfolio.ranking_tier || (portfolio.is_verified ? 'elite' : 'pro'),
    bio: portfolio.bio || '',
    careerSummary: portfolio.careerSummary || portfolio.bio || '',
    dateOfBirth: portfolio.dateOfBirth || '',
    height: portfolio.height || '',
    dominantHand: portfolio.dominantHand || '',
    languages: portfolio.languages || ['Urdu', 'English'],
    email: portfolio.email || '',
    phone: portfolio.phone || '',
    location: portfolio.location || '',
    website: portfolio.website || '',
    agent: portfolio.agent || '',
    agentEmail: portfolio.agentEmail || '',
    agentPhone: portfolio.agentPhone || '',
    social: {
      instagram: portfolio.social_links?.instagram || '',
      twitter: portfolio.social_links?.twitter || '',
      facebook: portfolio.social_links?.facebook || '',
      linkedin: portfolio.social_links?.linkedin || '',
      youtube: portfolio.social_links?.youtube || '',
      tiktok: portfolio.social_links?.tiktok || '',
      website: portfolio.social_links?.website || portfolio.website || '',
    },
    stats: portfolio.statistics || {},
    achievements: portfolio.achievements || [],
    tournaments: portfolio.tournaments || [],
    skills: portfolio.skills || [],
    teamHistory: portfolio.teamHistory || [],
    certifications: portfolio.certifications || [],
    videos: portfolio.videos || [],
    gallery: portfolio.gallery || portfolioMedia,
    sponsorships: portfolio.sponsorships || [],
    specialties: portfolio.specialties || [],
    views_count: portfolio.views_count || 0,
    is_verified: portfolio.is_verified || false,
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({ 
      title: "Portfolio link copied!",
      description: "Share this link with others to showcase this athlete."
    });
  };

  const getRankingBadge = (tier: string) => {
    switch (tier) {
      case 'elite':
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30 text-sm"><Trophy className="h-3 w-3 mr-1" /> Elite</Badge>;
      case 'pro':
        return <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 text-sm"><Star className="h-3 w-3 mr-1" /> Pro</Badge>;
      case 'amateur':
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-sm"><TrendingUp className="h-3 w-3 mr-1" /> Amateur</Badge>;
      default:
        return <Badge variant="secondary">{tier}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/20" />
        
        {/* Back Button */}
        <div className="relative max-w-7xl mx-auto mb-8">
          <Link 
            to="/players" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Players
          </Link>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Profile Image */}
            <div className="relative">
              <Avatar className="h-40 w-40 lg:h-56 lg:w-56 border-4 border-primary/20 shadow-2xl">
                <AvatarImage src={player.photo} alt={player.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-4xl lg:text-5xl font-bold">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                {getRankingBadge(player.rankingTier)}
              </div>
            </div>

            {/* Player Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl lg:text-5xl font-display font-bold text-foreground mb-2">
                    {player.name}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-primary" />
                      {player.sport}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {player.country}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Rank #{player.ranking}
                    </span>
                  </div>
                </div>

                {/* Share Button */}
                <Button onClick={handleShare} variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Portfolio
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                {player.social.instagram && (
                  <a 
                    href={`https://instagram.com/${player.social.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {player.social.twitter && (
                  <a 
                    href={`https://twitter.com/${player.social.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {player.social.website && (
                  <a 
                    href={`https://${player.social.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
                <a 
                  href={`mailto:${player.email}`}
                  className="p-2 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="text-center p-3 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold text-primary">{player.views_count?.toLocaleString() || 0}</p>
                  <p className="text-xs text-muted-foreground">Profile Views</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold text-primary">{player.achievements?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Awards</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold text-primary">{player.tournaments?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Tournaments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Page Portfolio Content */}
      <main className="pb-20">
        {/* Section 1: About & Bio */}
        <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-display font-bold text-foreground">About</h2>
                <p className="text-muted-foreground">Biography & Career Overview</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="glass border-0 shadow-xl">
                  <CardContent className="p-8">
                    <p className="text-lg text-foreground leading-relaxed mb-6">{player.bio}</p>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Career Summary
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">{player.careerSummary}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Info */}
                <Card className="glass border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      <div className="text-center p-4 rounded-lg bg-secondary/50">
                        <Calendar className="h-5 w-5 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                        <p className="font-semibold text-foreground">{player.dateOfBirth || 'N/A'}</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-secondary/50">
                        <Target className="h-5 w-5 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Height</p>
                        <p className="font-semibold text-foreground">{player.height || 'N/A'}</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-secondary/50">
                        <Shield className="h-5 w-5 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Dominant Hand</p>
                        <p className="font-semibold text-foreground">{player.dominantHand || 'N/A'}</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-secondary/50">
                        <Globe className="h-5 w-5 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Languages</p>
                        <p className="font-semibold text-foreground">{player.languages?.join(', ') || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                <Card className="glass border-0 shadow-xl bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Specialties
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {player.specialties?.map((specialty: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-sm py-2 px-4 bg-primary/10 text-primary border-primary/20">
                          <Medal className="h-3 w-3 mr-1" />
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="text-sm">{player.email}</span>
                    </div>
                    {player.phone && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                        <Phone className="h-4 w-4 text-primary" />
                        <span className="text-sm">{player.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm">{player.location}</span>
                    </div>
                    {player.agent && (
                      <>
                        <Separator />
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <p className="text-sm font-medium text-primary mb-1">Agent / Manager</p>
                          <p className="text-sm">{player.agent}</p>
                          {player.agentEmail && <p className="text-xs text-muted-foreground">{player.agentEmail}</p>}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Statistics */}
        <section id="statistics" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-display font-bold text-foreground">Statistics</h2>
                <p className="text-muted-foreground">Performance Data & Career Metrics</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Format Statistics */}
              {player.stats?.test && (
                <Card className="glass border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Clock className="h-5 w-5 text-primary" />
                      Test Cricket
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {[
                        { label: 'Matches', value: player.stats.test.matches },
                        { label: player.stats.test.runs ? 'Runs' : 'Wickets', value: player.stats.test.runs?.toLocaleString() || player.stats.test.wickets },
                        { label: 'Average', value: player.stats.test.average },
                        { label: player.stats.test.hundreds ? '100s' : '5W Hauls', value: player.stats.test.hundreds || player.stats.test.fiveWickets || 0 },
                        { label: '50s', value: player.stats.test.fifties || 0 },
                        { label: 'Best', value: player.stats.test.highest || player.stats.test.bestBowling || '-' },
                      ].map((stat, idx) => (
                        <div key={idx} className="text-center p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors">
                          <p className="text-2xl lg:text-3xl font-bold text-primary">{stat.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {player.stats?.odi && (
                <Card className="glass border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-accent/5 to-transparent">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Target className="h-5 w-5 text-accent" />
                      One Day Internationals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {[
                        { label: 'Matches', value: player.stats.odi.matches },
                        { label: player.stats.odi.runs ? 'Runs' : 'Wickets', value: player.stats.odi.runs?.toLocaleString() || player.stats.odi.wickets },
                        { label: 'Average', value: player.stats.odi.average },
                        { label: '100s', value: player.stats.odi.hundreds || 0 },
                        { label: '50s', value: player.stats.odi.fifties || 0 },
                        { label: 'Highest', value: player.stats.odi.highest || '-' },
                      ].map((stat, idx) => (
                        <div key={idx} className="text-center p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors">
                          <p className="text-2xl lg:text-3xl font-bold text-accent">{stat.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {player.stats?.t20i && (
                <Card className="glass border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-emerald-500/5 to-transparent">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Zap className="h-5 w-5 text-emerald-500" />
                      T20 Internationals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {[
                        { label: 'Matches', value: player.stats.t20i.matches },
                        { label: player.stats.t20i.runs ? 'Runs' : 'Wickets', value: player.stats.t20i.runs?.toLocaleString() || player.stats.t20i.wickets },
                        { label: 'Average', value: player.stats.t20i.average },
                        { label: player.stats.t20i.strikeRate ? 'Strike Rate' : 'Economy', value: player.stats.t20i.strikeRate || player.stats.t20i.economy || 0 },
                        { label: '50s', value: player.stats.t20i.fifties || 0 },
                        { label: 'Highest', value: player.stats.t20i.highest || '-' },
                      ].map((stat, idx) => (
                        <div key={idx} className="text-center p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors">
                          <p className="text-2xl lg:text-3xl font-bold text-emerald-500">{stat.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Career Totals */}
              {player.stats?.overall && (
                <Card className="glass border-0 shadow-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Trophy className="h-6 w-6 text-primary" />
                      Career Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      {[
                        { label: 'Total Matches', value: player.stats.overall.matches, icon: Target },
                        { label: player.stats.overall.runs ? 'Total Runs' : 'Total Wickets', value: player.stats.overall.runs?.toLocaleString() || player.stats.overall.wickets || 0, icon: TrendingUp },
                        { label: 'Catches', value: player.stats.overall.catches || 0, icon: Shield },
                        { label: 'Stumpings', value: player.stats.overall.stumpings || 0, icon: Award },
                      ].map((stat, idx) => (
                        <div key={idx} className="text-center p-6 rounded-xl bg-background/50 backdrop-blur-sm">
                          <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                          <p className="text-3xl lg:text-4xl font-bold text-foreground">{stat.value}</p>
                          <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Section 3: Achievements */}
        <section id="achievements" className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-display font-bold text-foreground">Achievements</h2>
                <p className="text-muted-foreground">Awards, Honors & Milestones</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {player.achievements?.map((achievement, index) => (
                <Card key={achievement.id} className="glass border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <achievement.icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{achievement.title}</h3>
                          <Badge variant="outline" className="text-primary border-primary/30">{achievement.year}</Badge>
                        </div>
                        <p className="text-sm text-primary font-medium mb-1">{achievement.category}</p>
                        {achievement.description && (
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Tournament History */}
        <section id="tournaments" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Flag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-display font-bold text-foreground">Tournament History</h2>
                <p className="text-muted-foreground">Major Competitions & Results</p>
              </div>
            </div>

            <Card className="glass border-0 shadow-xl">
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {player.tournaments?.map((tournament, index) => (
                    <div key={tournament.id} className="flex items-center gap-6 p-6 hover:bg-secondary/30 transition-colors">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{tournament.name}</h3>
                            <p className="text-sm text-muted-foreground">{tournament.location}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className="bg-primary/10 text-primary border-primary/20">{tournament.category}</Badge>
                            <Badge variant="outline" className="text-accent border-accent/30">{tournament.position}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-foreground">{tournament.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 5: Skills */}
        <section id="skills" className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-display font-bold text-foreground">Skills & Strengths</h2>
                <p className="text-muted-foreground">Technical Abilities & Expertise</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {['Technical', 'Physical', 'Mental', 'Leadership'].map((category) => {
                const categorySkills = player.skills?.filter((s: any) => s.category === category) || [];
                if (categorySkills.length === 0) return null;
                return (
                  <Card key={category} className="glass border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {category === 'Technical' && <Target className="h-5 w-5 text-primary" />}
                        {category === 'Physical' && <Shield className="h-5 w-5 text-accent" />}
                        {category === 'Mental' && <Zap className="h-5 w-5 text-emerald-500" />}
                        {category === 'Leadership' && <Star className="h-5 w-5 text-amber-500" />}
                        {category} Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {categorySkills.map((skill: any, idx: number) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">{skill.name}</span>
                            <span className="text-sm text-muted-foreground">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 6: Career History */}
        <section id="career" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-display font-bold text-foreground">Career History</h2>
                <p className="text-muted-foreground">Teams & Club Affiliations</p>
              </div>
            </div>

            <div className="space-y-6">
              {player.teamHistory?.map((team: any, index: number) => (
                <Card key={team.id} className="glass border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{team.team}</h3>
                            <p className="text-primary font-medium">{team.role}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline">{team.period}</Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {team.location}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{team.achievements}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Section 7: Gallery */}
        <section id="gallery" className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-display font-bold text-foreground">Gallery</h2>
                <p className="text-muted-foreground">Photos & Moments</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {player.gallery?.map((image: any) => (
                <div 
                  key={image.id} 
                  className="group relative aspect-square rounded-xl overflow-hidden bg-secondary/50 cursor-pointer shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="font-medium text-sm">{image.caption}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">{image.category}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 8: Sponsorships */}
        {player.sponsorships?.length > 0 && (
          <section id="sponsorships" className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground">Partners & Sponsors</h2>
                  <p className="text-muted-foreground">Brand Endorsements & Collaborations</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {player.sponsorships?.map((sponsor: any) => (
                  <Card key={sponsor.id} className="glass border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 rounded-xl bg-secondary/50 mx-auto mb-4 flex items-center justify-center">
                        <Heart className="h-8 w-8 text-primary/50" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{sponsor.brand}</h3>
                      <p className="text-xs text-primary">{sponsor.type}</p>
                      <p className="text-xs text-muted-foreground mt-1">Since {sponsor.since}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PlayerPortfolio;