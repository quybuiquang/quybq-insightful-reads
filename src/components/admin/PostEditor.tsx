import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminPost, useCreatePost, useUpdatePost } from '@/hooks/useAdminPosts';
import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

interface PostEditorProps {
  postId: string | null;
  onClose: () => void;
}

export function PostEditor({ postId, onClose }: PostEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content_vi: '',
    content_en: '',
    category_id: '',
    featured_image_url: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    meta_title_vi: '',
    meta_description_vi: '',
    meta_title_en: '',
    meta_description_en: '',
    read_time: 0,
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { data: post, isLoading: isLoadingPost } = useAdminPost(postId);
  const { data: categories } = useCategories();
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();

  const isEditing = !!postId;
  const isLoading = createPostMutation.isPending || updatePostMutation.isPending;

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        content_vi: post.content_vi || '',
        content_en: post.content_en || '',
        category_id: post.category_id,
        featured_image_url: post.featured_image_url || '',
        status: post.status as 'draft' | 'published' | 'archived',
        meta_title_vi: post.meta_title_vi || '',
        meta_description_vi: post.meta_description_vi || '',
        meta_title_en: post.meta_title_en || '',
        meta_description_en: post.meta_description_en || '',
        read_time: post.read_time || 0,
      });
    }
  }, [post]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleContentChange = (field: 'content_vi' | 'content_en', content: string) => {
    const readTime = calculateReadTime(content);
    setFormData(prev => ({
      ...prev,
      [field]: content,
      read_time: Math.max(prev.read_time, readTime),
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog_images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('blog_images')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        featured_image_url: publicUrl,
      }));

      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category_id || !user) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const postData = {
        ...formData,
        author_id: user.id,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
      };

      if (isEditing) {
        await updatePostMutation.mutateAsync({ id: postId, ...postData });
        toast.success('Post updated successfully');
      } else {
        await createPostMutation.mutateAsync(postData);
        toast.success('Post created successfully');
      }
      
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save post');
    }
  };

  if (isLoadingPost) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading post...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground">
              {isEditing ? 'Edit Post' : 'New Post'}
            </h2>
            <p className="text-muted-foreground">
              {isEditing ? 'Update your blog post' : 'Create a new blog post'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {formData.status === 'published' && formData.slug && (
            <Button variant="outline" asChild>
              <a href={`/posts/${formData.slug}`} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </a>
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="post-slug"
                required
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name_vi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'draft' | 'published' | 'archived') => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="read_time">Read Time (minutes)</Label>
              <Input
                id="read_time"
                type="number"
                value={formData.read_time}
                onChange={(e) => setFormData(prev => ({ ...prev, read_time: parseInt(e.target.value) || 0 }))}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <Label>Featured Image</Label>
          <div className="mt-2">
            {formData.featured_image_url ? (
              <div className="relative inline-block">
                <img
                  src={formData.featured_image_url}
                  alt="Featured"
                  className="w-48 h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2"
                  onClick={() => setFormData(prev => ({ ...prev, featured_image_url: '' }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload or drag and drop
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Choose File'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="content-vi" className="space-y-4">
          <TabsList>
            <TabsTrigger value="content-vi">Vietnamese Content</TabsTrigger>
            <TabsTrigger value="content-en">English Content</TabsTrigger>
            <TabsTrigger value="seo">SEO Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content-vi" className="space-y-4">
            <div>
              <Label htmlFor="content_vi">Vietnamese Content</Label>
              <Textarea
                id="content_vi"
                value={formData.content_vi}
                onChange={(e) => handleContentChange('content_vi', e.target.value)}
                placeholder="Write your content in Vietnamese (supports Markdown)"
                rows={20}
                className="font-mono"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="content-en" className="space-y-4">
            <div>
              <Label htmlFor="content_en">English Content</Label>
              <Textarea
                id="content_en"
                value={formData.content_en}
                onChange={(e) => handleContentChange('content_en', e.target.value)}
                placeholder="Write your content in English (supports Markdown)"
                rows={20}
                className="font-mono"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="seo" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Vietnamese SEO</h3>
                <div>
                  <Label htmlFor="meta_title_vi">Meta Title</Label>
                  <Input
                    id="meta_title_vi"
                    value={formData.meta_title_vi}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title_vi: e.target.value }))}
                    placeholder="SEO title in Vietnamese"
                  />
                </div>
                <div>
                  <Label htmlFor="meta_description_vi">Meta Description</Label>
                  <Textarea
                    id="meta_description_vi"
                    value={formData.meta_description_vi}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description_vi: e.target.value }))}
                    placeholder="SEO description in Vietnamese"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">English SEO</h3>
                <div>
                  <Label htmlFor="meta_title_en">Meta Title</Label>
                  <Input
                    id="meta_title_en"
                    value={formData.meta_title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title_en: e.target.value }))}
                    placeholder="SEO title in English"
                  />
                </div>
                <div>
                  <Label htmlFor="meta_description_en">Meta Description</Label>
                  <Textarea
                    id="meta_description_en"
                    value={formData.meta_description_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description_en: e.target.value }))}
                    placeholder="SEO description in English"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}