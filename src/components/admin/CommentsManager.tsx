import { useState } from 'react';
import { MessageSquare, Check, X, Trash2, Search } from 'lucide-react';
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
import { useAdminComments, useUpdateCommentStatus, useDeleteComment } from '@/hooks/useAdminComments';
import { toast } from '@/components/ui/sonner';

export function CommentsManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: comments, isLoading } = useAdminComments();
  const updateStatusMutation = useUpdateCommentStatus();
  const deleteCommentMutation = useDeleteComment();

  const filteredComments = comments?.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.posts?.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleStatusUpdate = async (commentId: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ commentId, status });
      toast.success(`Comment ${status} successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update comment status');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await deleteCommentMutation.mutateAsync(commentId);
      toast.success('Comment deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete comment');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'spam':
        return <Badge variant="outline">Spam</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Comments</h2>
          <p className="text-muted-foreground">Manage blog comments</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search comments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected', 'spam'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Comments Table */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading comments...</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Post</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No comments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredComments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {comment.author_name || 'Anonymous'}
                        </p>
                        {comment.author_email && (
                          <p className="text-sm text-muted-foreground">
                            {comment.author_email}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-xs truncate">
                        {comment.content}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-xs truncate">
                        {comment.posts?.title}
                      </p>
                    </TableCell>
                    <TableCell>{getStatusBadge(comment.status)}</TableCell>
                    <TableCell>
                      {new Date(comment.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {comment.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusUpdate(comment.id, 'approved')}
                              disabled={updateStatusMutation.isPending}
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusUpdate(comment.id, 'rejected')}
                              disabled={updateStatusMutation.isPending}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        {comment.status === 'approved' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusUpdate(comment.id, 'rejected')}
                            disabled={updateStatusMutation.isPending}
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                        {comment.status === 'rejected' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusUpdate(comment.id, 'approved')}
                            disabled={updateStatusMutation.isPending}
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(comment.id)}
                          disabled={deleteCommentMutation.isPending}
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