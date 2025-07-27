import { Search, TrendingUp, Clock, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const recentPosts = [
  {
    title: 'Tác động của trí tuệ nhân tạo đến thị trường lao động Việt Nam',
    href: '/ai-labor-market',
    publishedAt: '2 ngày trước',
  },
  {
    title: 'Phân tích chính sách kinh tế vĩ mô mới của chính phủ',
    href: '/macro-economic-policy',
    publishedAt: '5 ngày trước',
  },
  {
    title: 'Văn hóa số hóa: Cơ hội và thách thức cho thế hệ Z',
    href: '/digital-culture-gen-z',
    publishedAt: '1 tuần trước',
  },
];

const popularTags = [
  'Phân tích chính trị',
  'Kinh tế Việt Nam',
  'Công nghệ AI',
  'Phát triển bền vững',
  'Văn hóa số',
  'Quan hệ quốc tế',
  'Thị trường tài chính',
  'Đổi mới sáng tạo',
];

const trendingTopics = [
  {
    title: 'Chuyển đổi số trong giáo dục',
    count: '12 bài viết',
  },
  {
    title: 'Kinh tế xanh và ESG',
    count: '8 bài viết',
  },
  {
    title: 'Geopolitics Đông Nam Á',
    count: '15 bài viết',
  },
];

export function Sidebar() {
  return (
    <aside className="w-sidebar space-y-8">
      {/* Search */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center">
          <Search className="h-5 w-5 mr-2" />
          Tìm kiếm
        </h3>
        <div className="relative">
          <Input
            placeholder="Tìm kiếm bài viết..."
            className="pr-10"
          />
          <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Bài viết gần đây
        </h3>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <article key={post.href} className="group">
              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors mb-1">
                <a href={post.href} className="hover:underline line-clamp-2">
                  {post.title}
                </a>
              </h4>
              <p className="text-sm text-muted-foreground">{post.publishedAt}</p>
            </article>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Chủ đề nổi bật
        </h3>
        <div className="space-y-3">
          {trendingTopics.map((topic) => (
            <div key={topic.title} className="group cursor-pointer">
              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                {topic.title}
              </h4>
              <p className="text-sm text-muted-foreground">{topic.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center">
          <Tag className="h-5 w-5 mr-2" />
          Thẻ phổ biến
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Button
              key={tag}
              variant="secondary"
              size="sm"
              className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 border border-primary/20">
        <h3 className="font-heading font-semibold text-foreground mb-2">
          Đăng ký nhận tin
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Nhận thông báo về các bài phân tích mới nhất từ quy.bq
        </p>
        <div className="space-y-3">
          <Input placeholder="Email của bạn" />
          <Button className="w-full">
            Đăng ký
          </Button>
        </div>
      </div>
    </aside>
  );
}