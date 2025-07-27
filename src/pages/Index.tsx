import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/ArticleCard';
import { Sidebar } from '@/components/Sidebar';
import { usePosts } from '@/hooks/usePosts';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowRight, TrendingUp, Clock, Eye } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

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
  const { data: posts, isLoading } = usePosts('published');
  const { language } = useLanguage();

  const featuredPost = posts?.[0];
  const recentPosts = posts?.slice(1, 5) || [];

  return (
    <>
      <Helmet>
        <title>quy.bq - {language === 'vi' ? 'Phân tích xã hội chuyên sâu' : 'In-depth Social Analysis'}</title>
        <meta 
          name="description" 
          content={language === 'vi' 
            ? 'Blog cá nhân chia sẻ phân tích xã hội chuyên sâu, góc nhìn đa chiều về chính trị, kinh tế, văn hóa và đời sống.'
            : 'Personal blog sharing in-depth social analysis, multi-dimensional perspectives on politics, economics, culture and life.'
          } 
        />
        <link rel="canonical" href={window.location.origin} />
      </Helmet>

    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background to-secondary/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-content py-section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6 leading-tight">
                {language === 'vi' ? (
                  <>
                    Phân tích xã hội 
                    <span className="text-primary"> chuyên sâu</span>
                  </>
                ) : (
                  <>
                    In-depth 
                    <span className="text-primary"> Social Analysis</span>
                  </>
                )}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {language === 'vi' 
                  ? 'Chia sẻ góc nhìn đa chiều về chính trị, kinh tế, văn hóa và những vấn đề quan trọng của thời đại thông qua các bài phân tích có chiều sâu và dữ liệu thực tế.'
                  : 'Sharing multi-dimensional perspectives on politics, economics, culture and important issues of our time through in-depth analysis and real data.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <a href="#latest-articles">
                    {language === 'vi' ? 'Khám phá bài viết' : 'Explore Articles'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="/about">{language === 'vi' ? 'Về tác giả' : 'About Author'}</a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt={language === 'vi' ? 'Phân tích xã hội' : 'Social Analysis'}
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
              <p className="text-muted-foreground">
                {language === 'vi' ? 'Bài phân tích chuyên sâu' : 'In-depth Articles'}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-8 w-8 text-primary mr-2" />
                <span className="text-3xl font-heading font-bold text-foreground">50K+</span>
              </div>
              <p className="text-muted-foreground">
                {language === 'vi' ? 'Lượt đọc hàng tháng' : 'Monthly Readers'}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-8 w-8 text-primary mr-2" />
                <span className="text-3xl font-heading font-bold text-foreground">12</span>
              </div>
              <p className="text-muted-foreground">
                {language === 'vi' ? 'Phút đọc trung bình' : 'Average Read Time'}
              </p>
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
                  {language === 'vi' ? 'Bài viết nổi bật' : 'Featured Articles'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'vi' 
                    ? 'Những phân tích mới nhất về các vấn đề xã hội quan trọng'
                    : 'Latest analysis on important social issues'
                  }
                </p>
              </div>

              {/* Featured Article */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">
                    {language === 'vi' ? 'Đang tải...' : 'Loading...'}
                  </p>
                </div>
              ) : featuredPost ? (
                <div className="mb-12">
                  <ArticleCard
                    title={featuredPost.title}
                    excerpt={language === 'vi' ? featuredPost.content_vi?.substring(0, 200) + '...' : featuredPost.content_en?.substring(0, 200) + '...'}
                    category={language === 'vi' ? featuredPost.categories.name_vi : featuredPost.categories.name_en}
                    readTime={`${featuredPost.read_time} ${language === 'vi' ? 'phút đọc' : 'min read'}`}
                    publishedAt={new Date(featuredPost.published_at!).toLocaleDateString(
                      language === 'vi' ? 'vi-VN' : 'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                    featuredImage={featuredPost.featured_image_url}
                    href={`/posts/${featuredPost.slug}`}
                    featured={true}
                  />
                </div>
              ) : null}

              {/* Recent Articles Grid */}
              <div className="mb-8">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
                  {language === 'vi' ? 'Bài viết gần đây' : 'Recent Articles'}
                </h3>
                {recentPosts.length > 0 ? (
                  <div className="article-grid">
                    {recentPosts.map((post) => (
                      <ArticleCard
                        key={post.id}
                        title={post.title}
                        excerpt={language === 'vi' ? post.content_vi?.substring(0, 150) + '...' : post.content_en?.substring(0, 150) + '...'}
                        category={language === 'vi' ? post.categories.name_vi : post.categories.name_en}
                        readTime={`${post.read_time} ${language === 'vi' ? 'phút đọc' : 'min read'}`}
                        publishedAt={new Date(post.published_at!).toLocaleDateString(
                          language === 'vi' ? 'vi-VN' : 'en-US',
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                        featuredImage={post.featured_image_url}
                        href={`/posts/${post.slug}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>{language === 'vi' ? 'Chưa có bài viết nào' : 'No articles yet'}</p>
                  </div>
                )}
              </div>

              {/* Load More */}
              {posts && posts.length > 5 && (
                <div className="text-center">
                  <Button variant="outline" size="lg">
                    {language === 'vi' ? 'Xem thêm bài viết' : 'Load More Articles'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </main>

            {/* Sidebar */}
            <Sidebar />
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Index;
