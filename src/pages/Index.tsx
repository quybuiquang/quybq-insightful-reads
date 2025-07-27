import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/ArticleCard';
import { Sidebar } from '@/components/Sidebar';
import { ArrowRight, TrendingUp, Clock, Eye } from 'lucide-react';

// Import featured images
import heroImage from '@/assets/hero-analysis.jpg';
import aiLaborImage from '@/assets/featured-ai-labor.jpg';
import economicsImage from '@/assets/featured-economics.jpg';
import digitalCultureImage from '@/assets/featured-digital-culture.jpg';

// Mock data for articles
const featuredArticle = {
  title: 'Tác động của trí tuệ nhân tạo đến thị trường lao động Việt Nam: Phân tích đa chiều',
  excerpt: 'Một nghiên cứu sâu về cách AI đang thay đổi bộ mặt thị trường lao động tại Việt Nam, từ những cơ hội mới đến những thách thức cần được giải quyết một cách bài bản và có chiến lược.',
  category: 'Khoa học & Công nghệ',
  readTime: '12 phút đọc',
  publishedAt: '2 ngày trước',
  featuredImage: aiLaborImage,
  href: '/ai-labor-market-vietnam',
  featured: true,
};

const recentArticles = [
  {
    title: 'Phân tích chính sách kinh tế vĩ mô mới của chính phủ',
    excerpt: 'Đánh giá những thay đổi trong chính sách kinh tế và tác động dự kiến đến tăng trưởng GDP trong năm 2024.',
    category: 'Kinh tế & Thị trường',
    readTime: '8 phút đọc',
    publishedAt: '5 ngày trước',
    featuredImage: economicsImage,
    href: '/macro-economic-policy-2024',
  },
  {
    title: 'Văn hóa số hóa: Cơ hội và thách thức cho thế hệ Z',
    excerpt: 'Khám phá cách thế hệ Z định hình lại văn hóa thông qua các nền tảng số và những tác động xã hội sâu rộng.',
    category: 'Văn hóa & Đời sống',
    readTime: '10 phút đọc',
    publishedAt: '1 tuần trước',
    featuredImage: digitalCultureImage,
    href: '/digital-culture-gen-z',
  },
  {
    title: 'Quan hệ Việt - Mỹ trong bối cảnh geopolitics mới',
    excerpt: 'Phân tích những thay đổi trong quan hệ song phương và vị thế của Việt Nam trong khu vực.',
    category: 'Chính trị & Quan hệ quốc tế',
    readTime: '15 phút đọc',
    publishedAt: '2 tuần trước',
    href: '/vietnam-us-relations-2024',
  },
  {
    title: 'Chuyển đổi xanh trong doanh nghiệp Việt Nam',
    excerpt: 'Những bước tiến của doanh nghiệp Việt trong việc áp dụng các tiêu chuẩn ESG và phát triển bền vững.',
    category: 'Môi trường & Phát triển bền vững',
    readTime: '9 phút đọc',
    publishedAt: '3 tuần trước',
    href: '/green-transformation-vietnam',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background to-secondary/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-content py-section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6 leading-tight">
                Phân tích xã hội 
                <span className="text-primary"> chuyên sâu</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Chia sẻ góc nhìn đa chiều về chính trị, kinh tế, văn hóa và những vấn đề 
                quan trọng của thời đại thông qua các bài phân tích có chiều sâu và dữ liệu thực tế.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <a href="#latest-articles">
                    Khám phá bài viết
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="/about">Về tác giả</a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Phân tích xã hội"
                className="rounded-lg shadow-xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-content py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-primary mr-2" />
                <span className="text-3xl font-heading font-bold text-foreground">150+</span>
              </div>
              <p className="text-muted-foreground">Bài phân tích chuyên sâu</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-8 w-8 text-primary mr-2" />
                <span className="text-3xl font-heading font-bold text-foreground">50K+</span>
              </div>
              <p className="text-muted-foreground">Lượt đọc hàng tháng</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-8 w-8 text-primary mr-2" />
                <span className="text-3xl font-heading font-bold text-foreground">12</span>
              </div>
              <p className="text-muted-foreground">Phút đọc trung bình</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="latest-articles" className="py-section">
        <div className="max-w-7xl mx-auto px-content">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Articles */}
            <main className="flex-1">
              <div className="mb-8">
                <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                  Bài viết nổi bật
                </h2>
                <p className="text-muted-foreground">
                  Những phân tích mới nhất về các vấn đề xã hội quan trọng
                </p>
              </div>

              {/* Featured Article */}
              <div className="mb-12">
                <ArticleCard {...featuredArticle} />
              </div>

              {/* Recent Articles Grid */}
              <div className="mb-8">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
                  Bài viết gần đây
                </h3>
                <div className="article-grid">
                  {recentArticles.map((article, index) => (
                    <ArticleCard key={index} {...article} />
                  ))}
                </div>
              </div>

              {/* Load More */}
              <div className="text-center">
                <Button variant="outline" size="lg">
                  Xem thêm bài viết
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </main>

            {/* Sidebar */}
            <Sidebar />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
