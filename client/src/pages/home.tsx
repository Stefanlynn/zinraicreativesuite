import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Play, Image, FileText, Package, ArrowRight, Search, Filter, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CategoryType, ContentItem } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";

import Footer from "@/components/footer";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('social-media');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('title');
  const { toast } = useToast();

  const { data: allItems, isLoading } = useQuery({
    queryKey: ['/api/content', activeCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeCategory !== 'all') params.append('category', activeCategory);
      
      const response = await fetch(`/api/content?${params}`);
      if (!response.ok) throw new Error('Failed to fetch content');
      return response.json() as Promise<ContentItem[]>;
    },
  });

  // Filter and sort items based on search and filters
  const filteredItems = allItems?.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'downloads':
        return (b.downloadCount || 0) - (a.downloadCount || 0);
      case 'newest':
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      default:
        return 0;
    }
  }) || [];

  const handleDownload = async (item: ContentItem) => {
    try {
      // Track the download
      await fetch(`/api/content/${item.id}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Open the external link in a new tab
      window.open(item.fileUrl, '_blank');
      
      toast({
        title: "Opening file",
        description: `${item.title} is opening in a new tab`,
      });
    } catch (error) {
      // Even if tracking fails, still open the file
      window.open(item.fileUrl, '_blank');
      toast({
        title: "Opening file",
        description: `${item.title} is opening in a new tab`,
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
      case 'general': return 'General';
      case 'social-media': return 'Social Media';
      case 'field-tools': return 'Field Tools';
      case 'events': return 'Events';
      case 'store': return 'ZiNRAi Store';
      default: return 'All Content';
    }
  };

  const getCategoryDescription = (category: CategoryType) => {
    switch (category) {
      case 'general': return 'General purpose templates and resources for everyday use';
      case 'social-media': return 'Reels, graphics, and content designed to engage your audience';
      case 'field-tools': return 'Professional tools and resources for field operations';
      case 'events': return 'Graphics and videos for events and special occasions';
      case 'store': return 'Branded merchandise and promotional materials';
      default: return 'Browse all available creative assets and tools';
    }
  };

  const categories = [
    { id: 'general' as CategoryType, label: 'General' },
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
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => window.location.href = '/request-project'}
                className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 shadow-lg hover:shadow-yellow-500/25 transform hover:-translate-y-0.5"
              >
                Request Project
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin/login'}
                variant="ghost"
                className="text-xs text-zinrai-muted hover:text-zinrai-muted"
              >
                Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Video Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            {/* Hero video will be the main focus */}
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
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {getCategoryTitle(activeCategory)}
                </h2>
                <p className="text-zinrai-muted">
                  {getCategoryDescription(activeCategory)}
                </p>
              </div>
              <div className="text-sm text-zinrai-muted">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-zinrai-surface rounded-xl border border-zinrai-border p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinrai-muted h-4 w-4" />
                  <Input
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-zinrai-dark border-zinrai-border text-white placeholder-zinrai-muted"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="bg-zinrai-dark border-zinrai-border text-white">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="graphic">Graphic</SelectItem>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="bundle">Bundle</SelectItem>
                    <SelectItem value="mockup">Mockup</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-zinrai-dark border-zinrai-border text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="downloads">Most Downloaded</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('all');
                    setSortBy('title');
                  }}
                  variant="outline"
                  className="border-zinrai-border text-zinrai-muted hover:text-white hover:bg-zinrai-dark"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {activeCategory === 'store' ? (
            <div className="text-center py-24">
              <div className="max-w-md mx-auto">
                <div className="bg-zinrai-surface rounded-3xl p-12 border border-zinrai-border">
                  <div className="w-16 h-16 bg-zinrai-accent/30 rounded-full mx-auto mb-6"></div>
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
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-zinrai-surface rounded-lg p-4 border border-zinrai-border">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 bg-zinrai-border rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-1/3 mb-2 bg-zinrai-border" />
                      <Skeleton className="h-4 w-2/3 bg-zinrai-border" />
                    </div>
                    <Skeleton className="h-8 w-20 bg-zinrai-border rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-zinrai-surface rounded-lg p-4 border border-zinrai-border hover:border-zinrai-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 bg-cover bg-center rounded-lg flex-shrink-0 border border-zinrai-border"
                      style={{ backgroundImage: `url(${item.thumbnailUrl})` }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-medium truncate">{item.title}</h3>
                        {item.featured && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="border-zinrai-border text-zinrai-muted text-xs">
                          {getTypeIcon(item.type)}
                          <span className="ml-1 capitalize">{item.type}</span>
                        </Badge>
                        <span className="text-xs text-zinrai-muted">
                          {item.downloadCount ? `${item.downloadCount} downloads` : 'New'}
                        </span>
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-zinrai-muted truncate">{item.description}</p>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => handleDownload(item)}
                      size="sm"
                      className="bg-white text-black hover:bg-gray-100 font-medium px-4 py-2 h-auto rounded-lg transition-colors"
                    >
                      <ExternalLink className="h-3 w-3 mr-1.5" />
                      Get File
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-zinrai-muted text-lg">
                {searchQuery || typeFilter !== 'all' 
                  ? 'No items match your filters' 
                  : 'No content available in this category'}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
