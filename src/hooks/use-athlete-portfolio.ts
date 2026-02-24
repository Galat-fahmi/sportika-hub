import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import {
  getMyPortfolio,
  updateAthletePortfolio,
  uploadPortfolioImage,
  addPortfolioAchievement,
  deletePortfolioAchievement,
  addPortfolioGalleryImage,
  deletePortfolioGalleryImage,
  generateSlug
} from "@/lib/athlete-portfolio-api";

export const useAthletePortfolio = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch athlete's portfolio
  const { data: portfolio, isLoading, error } = useQuery({
    queryKey: ['athlete-portfolio', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      return getMyPortfolio(user.id);
    },
    enabled: !!user,
  });

  // Update portfolio mutation
  const updatePortfolio = useMutation({
    mutationFn: async (portfolioData: Parameters<typeof updateAthletePortfolio>[1]) => {
      if (!user) throw new Error("User not authenticated");
      return updateAthletePortfolio(user.id, portfolioData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athlete-portfolio', user?.id] });
      toast({ title: "Portfolio updated successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating portfolio",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Upload image mutation
  const uploadImage = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: 'profile' | 'cover' | 'gallery' }) => {
      if (!user) throw new Error("User not authenticated");
      return uploadPortfolioImage(user.id, file, type);
    },
    onSuccess: () => {
      toast({ title: "Image uploaded successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Add achievement mutation
  const addAchievement = useMutation({
    mutationFn: async (achievement: Parameters<typeof addPortfolioAchievement>[1]) => {
      if (!portfolio?.id) throw new Error("Portfolio not found");
      return addPortfolioAchievement(portfolio.id, achievement);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athlete-portfolio', user?.id] });
      toast({ title: "Achievement added successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding achievement",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete achievement mutation
  const removeAchievement = useMutation({
    mutationFn: async (achievementId: string) => {
      return deletePortfolioAchievement(achievementId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athlete-portfolio', user?.id] });
      toast({ title: "Achievement removed successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error removing achievement",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Add gallery image mutation
  const addGalleryImage = useMutation({
    mutationFn: async (imageData: Parameters<typeof addPortfolioGalleryImage>[1]) => {
      if (!portfolio?.id) throw new Error("Portfolio not found");
      return addPortfolioGalleryImage(portfolio.id, imageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athlete-portfolio', user?.id] });
      toast({ title: "Image added to gallery!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding image",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete gallery image mutation
  const removeGalleryImage = useMutation({
    mutationFn: async (imageId: string) => {
      return deletePortfolioGalleryImage(imageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athlete-portfolio', user?.id] });
      toast({ title: "Image removed from gallery!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error removing image",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Publish portfolio
  const publishPortfolio = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");
      if (!portfolio?.title) throw new Error("Portfolio title is required");
      
      const slug = portfolio.slug || generateSlug(portfolio.title);
      
      return updateAthletePortfolio(user.id, {
        slug,
        visibility: 'public'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athlete-portfolio', user?.id] });
      toast({ title: "Portfolio published successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error publishing portfolio",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Toggle portfolio visibility
  const toggleVisibility = useMutation({
    mutationFn: async (visibility: 'public' | 'private') => {
      if (!user) throw new Error("User not authenticated");
      return updateAthletePortfolio(user.id, { visibility });
    },
    onSuccess: (_, visibility) => {
      queryClient.invalidateQueries({ queryKey: ['athlete-portfolio', user?.id] });
      toast({ 
        title: visibility === 'public' ? "Portfolio is now public!" : "Portfolio is now private!" 
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating visibility",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    portfolio,
    isLoading,
    error,
    updatePortfolio,
    uploadImage,
    addAchievement,
    removeAchievement,
    addGalleryImage,
    removeGalleryImage,
    publishPortfolio,
    toggleVisibility
  };
};

export default useAthletePortfolio;