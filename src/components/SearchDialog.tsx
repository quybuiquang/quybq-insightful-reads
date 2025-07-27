import { useState, useEffect } from 'react';
import { Search, Clock, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchPosts } from '@/hooks/usePosts';
import { useLanguage } from '@/hooks/useLanguage';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchDialogProps {
  children: React.ReactNode;
}

export function SearchDialog({ children }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { language } = useLanguage();
  
  const { data: searchResults, isLoading } = useSearchPosts(debouncedSearchTerm);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handlePostClick = (slug: string) => {
    setOpen(false);
    window.location.href = `/posts/${slug}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {language === 'vi' ? 'Tìm kiếm bài viết' : 'Search Articles'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={language === 'vi' ? 'Nhập từ khóa tìm kiếm...' : 'Enter search keywords...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {isLoading && debouncedSearchTerm && (
              <div className="text-center py-4 text-muted-foreground">
                {language === 'vi' ? 'Đang tìm kiếm...' : 'Searching...'}
              </div>
            )}
            
            {searchResults && searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handlePostClick(post.slug)}
                  >
                    <h3 className="font-medium text-foreground mb-1 line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {language === 'vi' ? post.content_vi?.substring(0, 150) : post.content_en?.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3 w-3" />
                        quy.bq
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.read_time} {language === 'vi' ? 'phút đọc' : 'min read'}
                      </span>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {language === 'vi' ? post.categories.name_vi : post.categories.name_en}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {searchResults && searchResults.length === 0 && debouncedSearchTerm && !isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{language === 'vi' ? 'Không tìm thấy bài viết nào' : 'No articles found'}</p>
                <p className="text-sm mt-1">
                  {language === 'vi' ? 'Thử với từ khóa khác' : 'Try different keywords'}
                </p>
              </div>
            )}
            
            {!debouncedSearchTerm && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{language === 'vi' ? 'Nhập từ khóa để tìm kiếm' : 'Enter keywords to search'}</p>
                <p className="text-sm mt-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd> + <kbd className="px-2 py-1 bg-muted rounded text-xs">K</kbd>
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}