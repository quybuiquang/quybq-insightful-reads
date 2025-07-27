import { useState } from 'react';
import { MessageCircle, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useComments, useAddComment } from '@/hooks/useComments';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from '@/components/ui/sonner';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { language } = useLanguage();
  const { data: comments, isLoading } = useComments(postId);
  const addCommentMutation = useAddComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !content.trim()) {
      toast.error(language === 'vi' ? 'Vui lòng điền đầy đủ thông tin' : 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addCommentMutation.mutateAsync({
        post_id: postId,
        content: content.trim(),
        author_name: name.trim(),
        author_email: email.trim() || null,
      });
      
      setName('');
      setEmail('');
      setContent('');
      
      toast.success(
        language === 'vi' 
          ? 'Bình luận đã được gửi và đang chờ duyệt' 
          : 'Comment submitted and pending approval'
      );
    } catch (error) {
      toast.error(
        language === 'vi' 
          ? 'Có lỗi xảy ra khi gửi bình luận' 
          : 'Error submitting comment'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="border-t border-border pt-12">
      <h2 className="text-2xl font-heading font-bold text-foreground mb-8 flex items-center gap-2">
        <MessageCircle className="h-6 w-6" />
        {language === 'vi' ? 'Bình luận' : 'Comments'}
        {comments && comments.length > 0 && (
          <span className="text-lg text-muted-foreground">({comments.length})</span>
        )}
      </h2>

      {/* Comment Form */}
      <div className="bg-card rounded-lg border border-border p-6 mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {language === 'vi' ? 'Để lại bình luận' : 'Leave a Comment'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                {language === 'vi' ? 'Tên' : 'Name'} <span className="text-destructive">*</span>
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'vi' ? 'Nhập tên của bạn' : 'Enter your name'}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                {language === 'vi' ? 'Email (tùy chọn)' : 'Email (optional)'}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'vi' ? 'Nhập email của bạn' : 'Enter your email'}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
              {language === 'vi' ? 'Nội dung' : 'Content'} <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={language === 'vi' ? 'Chia sẻ suy nghĩ của bạn...' : 'Share your thoughts...'}
              rows={4}
              required
            />
          </div>
          
          <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            {isSubmitting 
              ? (language === 'vi' ? 'Đang gửi...' : 'Submitting...') 
              : (language === 'vi' ? 'Gửi bình luận' : 'Submit Comment')
            }
          </Button>
        </form>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {language === 'vi' ? 'Đang tải bình luận...' : 'Loading comments...'}
          </p>
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-foreground">
                      {comment.author_name || (language === 'vi' ? 'Ẩn danh' : 'Anonymous')}
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString(
                        language === 'vi' ? 'vi-VN' : 'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </span>
                  </div>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">
            {language === 'vi' ? 'Chưa có bình luận nào' : 'No comments yet'}
          </p>
          <p className="text-sm">
            {language === 'vi' ? 'Hãy là người đầu tiên bình luận!' : 'Be the first to comment!'}
          </p>
        </div>
      )}
    </section>
  );
}