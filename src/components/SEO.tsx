import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

export const SEO = ({ 
  title, 
  description, 
  keywords = "Sportika Pakistan, sports platform Pakistan, sports events Pakistan, university sports Pakistan",
  ogImage = "https://sportika.pk/sportika-wolf-logo.png",
  canonical = "https://sportika.pk"
}: SEOProps) => {
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update meta tags
    const metaTags = {
      'description': description,
      'keywords': keywords,
      'og:title': title,
      'og:description': description,
      'og:image': ogImage,
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': ogImage,
    };

    Object.entries(metaTags).forEach(([name, content]) => {
      // Try to find existing meta tag
      let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (name.startsWith('og:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    });

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // Cleanup function
    return () => {
      // Optional: cleanup meta tags when component unmounts
    };
  }, [title, description, keywords, ogImage, canonical]);

  return null;
};

// Pre-configured SEO for common pages
export const PlayersSEO = () => (
  <SEO
    title="Elite Athletes Pakistan | Sports Players & Talent Directory | Sportika"
    description="Discover Pakistan's top athletes. Browse profiles of cricket, football, basketball players and more. Find talent for sponsorship, university teams, and corporate events in Karachi, Lahore, Islamabad."
    keywords="Pakistani athletes, sports players Pakistan, cricket players Pakistan, football players Pakistan, athlete profiles Pakistan, sports talent Pakistan, university athletes Pakistan, student athletes Pakistan, athlete sponsorship Pakistan, sports recruitment Pakistan"
    canonical="https://sportika.pk/players"
  />
);

export const BlogSEO = () => (
  <SEO
    title="Sports Blog Pakistan | Training Tips, Athlete Stories & News | Sportika"
    description="Read expert sports articles, training tips, athlete success stories, and latest sports news in Pakistan. Learn about cricket, football, fitness, nutrition, and mental game strategies."
    keywords="sports blog Pakistan, training tips Pakistan, athlete stories Pakistan, sports news Pakistan, cricket training Pakistan, football training Pakistan, fitness tips Pakistan, sports nutrition Pakistan, mental game sports Pakistan"
    canonical="https://sportika.pk/blog"
  />
);

export const SponsorshipSEO = () => (
  <SEO
    title="Athlete Sponsorship Pakistan | Sports Talent Scouting | Sportika"
    description="Connect with sponsorship opportunities for Pakistani athletes. Discover talented sportsmen and sportswomen for brand partnerships, university scholarships, and corporate sponsorships."
    keywords="athlete sponsorship Pakistan, sports sponsorship Pakistan, talent scouting Pakistan, brand partnerships athletes Pakistan, sports scholarships Pakistan, corporate sports sponsorship Pakistan, athlete endorsement Pakistan"
    canonical="https://sportika.pk/sponsorship"
  />
);

export default SEO;
