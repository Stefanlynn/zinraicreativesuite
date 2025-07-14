import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Play, Image, FileText, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CategoryType, ContentItem } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import ProjectRequestForm from "@/components/project-request-form";
import Footer from "@/components/footer";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('social-media');
  const { toast } = useToast();

  const { data: items, isLoading } = useQuery({
    queryKey: ['/api/content', activeCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeCategory !== 'all') params.append('category', activeCategory);
      
      const response = await fetch(`/api/content?${params}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      return response.json() as Promise<ContentItem[]>;
    },
  });

  const handleDownload = async (item: ContentItem) => {
    try {
      const response = await apiRequest('POST', `/api/content/${item.id}/download`);
      const data = await response.json();
      
      toast({
        title: "Download Started",
        description: `${item.title} is being downloaded.`,
      });
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = data.fileUrl;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-5 w-5" />;
      case 'graphic': return <Image className="h-5 w-5" />;
      case 'template': return <FileText className="h-5 w-5" />;
      case 'bundle': return <Package className="h-5 w-5" />;
      case 'mockup': return <Image className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getCategoryTitle = (category: CategoryType) => {
    switch (category) {
      case 'social-media': return 'Social Media';
      case 'field-tools': return 'Field Tools';
      case 'events': return 'Events';
      case 'store': return 'ZiNRAi Store';
      default: return 'All Content';
    }
  };

  const getCategoryDescription = (category: CategoryType) => {
    switch (category) {
      case 'social-media': return 'Reels, graphics, and content designed to engage your audience';
      case 'field-tools': return 'Professional tools and resources for field operations';
      case 'events': return 'Graphics and videos for events and special occasions';
      case 'store': return 'Branded merchandise and promotional materials';
      default: return 'Browse all available creative assets and tools';
    }
  };

  const categories = [
    { id: 'social-media' as CategoryType, label: 'Social Media' },
    { id: 'field-tools' as CategoryType, label: 'Field Tools' },
    { id: 'events' as CategoryType, label: 'Events' },
    { id: 'store' as CategoryType, label: 'ZiNRAi Store' },
  ];

  return (
    <div className="min-h-screen bg-zinrai-dark">
      {/* Header */}
      <header className="bg-zinrai-dark/90 backdrop-blur-xl border-b border-zinrai-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://zinrai.com/assets/Untitled%20design-BMaEhOTq.png" 
                alt="ZiNRAi Logo" 
                className="h-8 w-auto"
              />
              <div>
                <h1 className="text-lg font-semibold text-white">ZiNRAi Creative Suite</h1>
                <p className="text-xs text-zinrai-muted">Live With Passion. Lead With Purpose.</p>
              </div>
            </div>
            <Button 
              onClick={() => document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' })}
              className="secondary-btn"
            >
              Request Project
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Video Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Creative Excellence.
              <br />
              <span className="text-zinrai-accent">Delivered.</span>
            </h1>
            <p className="text-xl text-zinrai-muted max-w-3xl mx-auto mb-8">
              Access our premium collection of creative assets designed to elevate your brand and amplify your message.
            </p>
          </div>
          
          <div className="hero-video mb-16">
            <iframe
              src="https://www.youtube.com/embed/aB19kSzMGxo?autoplay=1&mute=1&loop=1&playlist=aB19kSzMGxo&controls=0&showinfo=0&rel=0&modestbranding=1"
              title="ZiNRAi Creative Suite"
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-8 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`nav-link ${activeCategory === category.id ? 'active' : ''}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-6 bg-zinrai-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              {getCategoryTitle(activeCategory)}
            </h2>
            <p className="text-zinrai-muted text-lg">
              {getCategoryDescription(activeCategory)}
            </p>
          </div>

          {activeCategory === 'store' ? (
            <div className="text-center py-24">
              <div className="max-w-md mx-auto">
                <div className="bg-zinrai-surface rounded-3xl p-12 border border-zinrai-border">
                  <div className="text-6xl mb-6">🚀</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Coming Soon</h3>
                  <p className="text-zinrai-muted text-lg mb-8">
                    The ZiNRAi Store is launching soon with exclusive merchandise and branded materials.
                  </p>
                  <div className="text-sm text-zinrai-accent">
                    Stay tuned for updates!
                  </div>
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-zinrai-surface rounded-2xl p-6">
                  <Skeleton className="h-48 w-full mb-4 bg-zinrai-border rounded-xl" />
                  <Skeleton className="h-6 w-3/4 mb-2 bg-zinrai-border" />
                  <Skeleton className="h-4 w-1/2 bg-zinrai-border" />
                </div>
              ))}
            </div>
          ) : items && items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} className="asset-card">
                  <div 
                    className="h-48 bg-cover bg-center rounded-xl mb-4"
                    style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
                  />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-zinrai-accent/20 text-zinrai-accent border-zinrai-accent/30">
                        {getTypeIcon(item.type)}
                        <span className="ml-2 capitalize">{item.type}</span>
                      </Badge>
                      {item.featured && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="text-zinrai-muted text-sm">{item.description}</p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-zinrai-muted">
                        {item.downloadCount ? `${item.downloadCount} downloads` : 'New'}
                      </div>
                      <Button
                        onClick={() => handleDownload(item)}
                        className="primary-btn text-sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-zinrai-muted text-lg">No content available in this category.</p>
            </div>
          )}
        </div>
      </section>

      <ProjectRequestForm />
      <Footer />
    </div>
  );
}
