import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  className?: string;
}

const StatsCard = ({ title, value, icon, description, className = "" }: StatsCardProps) => (
  <Card className={`group relative overflow-hidden border border-border/50 bg-card/90 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <CardContent className="p-6 relative z-10">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground tracking-wide">{title}</p>
        <div className="text-primary group-hover:scale-110 transition-transform duration-300">{icon}</div>
      </div>
      <p className="text-3xl font-display font-bold text-foreground tracking-tight">{value}</p>
      {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
    </CardContent>
  </Card>
);

export default StatsCard;
