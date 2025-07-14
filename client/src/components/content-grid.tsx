import { useQuery } from "@tanstack/react-query";
import { Download, Play, Image, FileText, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CategoryType, ContentItem } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";

interface ContentGridProps {
  category: CategoryType;
  searchQuery: string;
}

export default function ContentGrid({ category, searchQuery }: ContentGridProps) {
  const { toast } = useToast();

  const { data: items, isLoading, error } = useQuery({
    queryKey: ['/api/content', category, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (searchQuery) params.append('search', searchQuery);
      
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
      case 'video': return <Play className="h-4 w-4" />;
      case 'graphic': return <Image className="h-4 w-4" />;
      case 'template': return <FileText className="h-4 w-4" />;
      case 'bundle': return <Package className="h-4 w-4" />;
      case 'mockup': return <Image className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-600';
      case 'graphic': return 'bg-blue-600';
      case 'template': return 'bg-green-600';
      case 'bundle': return 'bg-purple-600';
      case 'mockup': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const getCategoryTitle = (cat: CategoryType) => {
    switch (cat) {
      case 'social-media': return 'Social Media Assets';
      case 'field-tools': return 'Field Tools';
      case 'events': return 'Events';
      case 'store': return 'ZiNRAi Store';
      default: return 'All Content';
    }
  };

  const getCategoryDescription = (cat: CategoryType) => {
    switch (cat) {
      case 'social-media': return 'Reels, graphics, and content designed to engage your audience';
      case 'field-tools': return 'Professional tools and resources for field operations';
      case 'events': return 'Graphics and videos for events and special occasions';
      case 'store': return 'Branded merchandise and promotional materials';
      default: return 'Browse all available creative assets and tools';
    }
  };

  if (error) {
    return (
      <section className="py-16 bg-zinrai-dark">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Failed to load content. Please try again.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="content-grid" className="py-16 bg-zinrai-dark">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-3xl font-bold mb-2 text-white">
              {getCategoryTitle(category)}
            </h3>
            <p className="text-zinrai-muted">
              {getCategoryDescription(category)}
            </p>
            {searchQuery && (
              <p className="text-sm text-zinrai-accent mt-2">
                Showing results for "{searchQuery}"
              </p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-zinrai-secondary rounded-lg overflow-hidden">
                <Skeleton className="aspect-video w-full bg-gray-700" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
                  <Skeleton className="h-4 w-1/2 mb-3 bg-gray-700" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-16 bg-gray-700" />
                    <Skeleton className="h-8 w-8 bg-gray-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="content-card">
                <div 
                  className={`aspect-${item.type === 'video' ? 'video' : 'square'} bg-cover bg-center`}
                  style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
                />
                <div className="p-4">
                  <h4 className="font-semibold mb-2 text-white">{item.title}</h4>
                  <p className="text-sm text-zinrai-muted mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge 
                      className={`text-xs text-white px-2 py-1 rounded ${getTypeBadgeColor(item.type)}`}
                    >
                      {getTypeIcon(item.type)}
                      <span className="ml-1 capitalize">{item.type}</span>
                    </Badge>
                    <Button
                      onClick={() => handleDownload(item)}
                      className="download-btn"
                      size="sm"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  {item.downloadCount && item.downloadCount > 0 && (
                    <div className="mt-2 text-xs text-zinrai-muted">
                      {item.downloadCount} downloads
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinrai-muted text-lg">
              {searchQuery ? 'No results found for your search.' : 'No content available in this category.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
