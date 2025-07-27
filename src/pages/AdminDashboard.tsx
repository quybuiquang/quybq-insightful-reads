import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  LogOut,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { PostsManager } from '@/components/admin/PostsManager';
import { CategoriesManager } from '@/components/admin/CategoriesManager';
import { CommentsManager } from '@/components/admin/CommentsManager';
import { toast } from '@/components/ui/sonner';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('posts');
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Sign out failed');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <a href="/" target="_blank" rel="noopener noreferrer">
                  View Site
                </a>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <PostsManager />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoriesManager />
          </TabsContent>

          <TabsContent value="comments" className="space-y-6">
            <CommentsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}