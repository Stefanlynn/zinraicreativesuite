import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  LogOut, 
  Shield, 
  Download,
  Star,
  Calendar,
  ExternalLink,
  BarChart3
} from 'lucide-react';
import type { ContentItem, ProjectRequest } from '@/lib/types';

const contentItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.enum(['social-media', 'field-tools', 'events', 'store']),
  type: z.enum(['video', 'graphic', 'template', 'bundle', 'mockup']),
  fileUrl: z.string().url('Must be a valid URL'),
  thumbnailUrl: z.string().url('Must be a valid URL'),
  featured: z.boolean().default(false),
});

type ContentItemFormData = z.infer<typeof contentItemSchema>;

export default function AdminDashboard() {
  const [location, setLocation] = useLocation();
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const token = localStorage.getItem('adminToken');
  
  // Check if user is authenticated
  if (!token) {
    setLocation('/admin/login');
    return null;
  }

  const form = useForm<ContentItemFormData>({
    resolver: zodResolver(contentItemSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'social-media',
      type: 'graphic',
      fileUrl: '',
      thumbnailUrl: '',
      featured: false,
    },
  });

  // Fetch content items
  const { data: contentItems, isLoading: contentLoading } = useQuery({
    queryKey: ['/api/content'],
    queryFn: async () => {
      const response = await apiRequest('/api/content');
      return response as ContentItem[];
    },
  });

  // Fetch project requests
  const { data: projectRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['/api/admin/project-requests'],
    queryFn: async () => {
      const response = await apiRequest('/api/admin/project-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response as ProjectRequest[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ContentItemFormData) => {
      await apiRequest('/api/admin/content', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast({
        title: "Success",
        description: "Content item created successfully",
      });
      setShowAddForm(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create content item",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ContentItemFormData) => {
      if (!editingItem) return;
      await apiRequest(`/api/admin/content/${editingItem.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast({
        title: "Success",
        description: "Content item updated successfully",
      });
      setEditingItem(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update content item",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/content/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      toast({
        title: "Success",
        description: "Content item deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete content item",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setLocation('/admin/login');
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    form.reset({
      title: item.title,
      description: item.description || '',
      category: item.category as any,
      type: item.type as any,
      fileUrl: item.fileUrl,
      thumbnailUrl: item.thumbnailUrl,
      featured: item.featured || false,
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this content item?')) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: ContentItemFormData) => {
    if (editingItem) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setShowAddForm(false);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-zinrai-dark">
      {/* Header */}
      <div className="bg-zinrai-surface border-b border-zinrai-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-zinrai-accent mr-3" />
              <h1 className="text-xl font-bold text-white">ZiNRAi Admin</h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-zinrai-border text-zinrai-muted hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-zinrai-surface border-zinrai-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-zinrai-accent" />
                Total Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {contentItems?.length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-zinrai-surface border-zinrai-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <Download className="h-5 w-5 mr-2 text-zinrai-accent" />
                Total Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {contentItems?.reduce((sum, item) => sum + (item.downloadCount || 0), 0) || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-zinrai-surface border-zinrai-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-zinrai-accent" />
                Project Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {projectRequests?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Items */}
          <div>
            <Card className="bg-zinrai-surface border-zinrai-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Content Assets</CardTitle>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="primary-btn"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Asset
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {contentLoading ? (
                  <div className="text-zinrai-muted">Loading...</div>
                ) : (
                  <div className="space-y-4">
                    {contentItems?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-zinrai-dark rounded-lg border border-zinrai-border">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-white truncate">{item.title}</h3>
                            {item.featured && (
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {item.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-zinrai-muted">
                            <span>{item.downloadCount || 0} downloads</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(item.fileUrl, '_blank')}
                              className="h-auto p-0 text-zinrai-accent hover:text-zinrai-accent/80"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View File
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="text-zinrai-muted hover:text-white"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Project Requests */}
          <div>
            <Card className="bg-zinrai-surface border-zinrai-border">
              <CardHeader>
                <CardTitle className="text-white">Project Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {requestsLoading ? (
                  <div className="text-zinrai-muted">Loading...</div>
                ) : (
                  <div className="space-y-4">
                    {projectRequests?.map((request) => (
                      <div key={request.id} className="p-4 bg-zinrai-dark rounded-lg border border-zinrai-border">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-white">{request.fullName}</h3>
                          <Badge variant="outline" className="text-xs">
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-zinrai-muted mb-2">{request.email}</p>
                        <p className="text-sm text-white mb-2">{request.projectType}</p>
                        <p className="text-xs text-zinrai-muted">{request.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-zinrai-surface border-zinrai-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingItem ? 'Edit Asset' : 'Add New Asset'}
                </CardTitle>
                <CardDescription className="text-zinrai-muted">
                  {editingItem ? 'Update the asset details' : 'Fill out all fields to create a complete content card that users will see'}
                </CardDescription>
                
                {/* Field Guide */}
                <div className="mt-4 p-4 bg-zinrai-dark rounded-lg border border-zinrai-border">
                  <h4 className="text-sm font-semibold text-white mb-2">Content Card Fields Guide:</h4>
                  <div className="text-xs text-zinrai-muted space-y-1">
                    <div><strong>Title:</strong> Main heading displayed on content card</div>
                    <div><strong>Category:</strong> Which tab the content appears under (Social Media, Field Tools, Events, Store)</div>
                    <div><strong>Content Type:</strong> Badge shown on card (Video, Graphic, Template, Bundle, Mockup) + enables filtering</div>
                    <div><strong>Featured:</strong> Adds yellow "Featured" badge to highlight important content</div>
                    <div><strong>Description:</strong> Subtitle text shown under title (optional but recommended)</div>
                    <div><strong>File URL:</strong> Direct link to file - opens in new tab when user clicks "Get File"</div>
                    <div><strong>Thumbnail URL:</strong> Preview image (64x64px) shown on the left side of each content item</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Title *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="form-input"
                                placeholder="e.g., Instagram Story Template"
                              />
                            </FormControl>
                            <p className="text-xs text-zinrai-muted mt-1">This appears as the main heading on the content card</p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Category *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="form-select">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="social-media">Social Media</SelectItem>
                                <SelectItem value="field-tools">Field Tools</SelectItem>
                                <SelectItem value="events">Events</SelectItem>
                                <SelectItem value="store">Store</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-zinrai-muted mt-1">Determines which tab the content appears under</p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Content Type *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="form-select">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="graphic">Graphic</SelectItem>
                                <SelectItem value="template">Template</SelectItem>
                                <SelectItem value="bundle">Bundle</SelectItem>
                                <SelectItem value="mockup">Mockup</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-zinrai-muted mt-1">Shows as a badge on the content card and enables filtering</p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="rounded border-zinrai-border"
                              />
                            </FormControl>
                            <div>
                              <FormLabel className="text-white">Featured Content</FormLabel>
                              <p className="text-xs text-zinrai-muted">Shows a "Featured" badge on the content card</p>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              className="form-textarea"
                              placeholder="Brief description of the content (optional but recommended)"
                            />
                          </FormControl>
                          <p className="text-xs text-zinrai-muted mt-1">Appears as subtitle text on the content card</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fileUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">File URL (Dropbox/Google Drive) *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="form-input"
                              placeholder="https://drive.google.com/... or https://dropbox.com/..."
                            />
                          </FormControl>
                          <p className="text-xs text-zinrai-muted mt-1">Direct link to the actual file - opens when user clicks "Get File"</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="thumbnailUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Thumbnail Image URL *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="form-input"
                              placeholder="https://example.com/thumbnail.jpg"
                            />
                          </FormControl>
                          <p className="text-xs text-zinrai-muted mt-1">Preview image shown on the content card (64x64px on list)</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        className="border-zinrai-border text-zinrai-muted hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="primary-btn"
                        disabled={createMutation.isPending || updateMutation.isPending}
                      >
                        {createMutation.isPending || updateMutation.isPending
                          ? 'Saving...'
                          : editingItem
                          ? 'Update Asset'
                          : 'Add Asset'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}