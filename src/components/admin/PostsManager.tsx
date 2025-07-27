import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePosts } from '@/hooks/usePosts';
import { PostEditor } from './PostEditor';
import { useDeletePost } from '@/hooks/useAdminPosts';
import { toast } from '@/components/ui/sonner';

export function PostsManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const { data: posts, isLoading } = usePosts('all');
  const deletePostMutation = useDeletePost();

  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.categories.name_vi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.categories.name_en.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = async (postId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await deletePostMutation.mutateAsync(postId);
      toast.success('Post deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete post');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (editingPost || isCreating) {
    return (
      <PostEditor
        postId={editingPost}
        onClose={() => {
          setEditingPost(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Posts</h2>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Posts Table */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No posts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-muted-foreground">/{post.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.categories.name_vi}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                    <TableCell>
                      {post.published_at 
                        ? new Date(post.published_at).toLocaleDateString()
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {post.status === 'published' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <a href={`/posts/${post.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingPost(post.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deletePostMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}