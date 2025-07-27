import { useParams, Navigate } from 'react-router-dom';
import { Clock, User, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePost } from '@/hooks/usePosts';
import { useLanguage } from '@/hooks/useLanguage';
import { TableOfContents } from '@/components/TableOfContents';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { CommentSection } from '@/components/CommentSection';
import { Helmet } from 'react-helmet-async';

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { data: post, isLoading, error } = usePost(slug!);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {language === 'vi' ? 'Đang tải...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return <Navigate to="/404" replace />;
  }

  const content = language === 'vi' ? post.content_vi : post.content_en;
  const metaTitle = language === 'vi' ? post.meta_title_vi : post.meta_title_en;
  const metaDescription = language === 'vi' ? post.meta_description_vi : post.meta_description_en;
  const categoryName = language === 'vi' ? post.categories.name_vi : post.categories.name_en;

  const publishedDate = new Date(post.published_at!).toLocaleDateString(
    language === 'vi' ? 'vi-VN' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  const wordCount = content?.split(' ').length || 0;
  const showTOC = wordCount > 800;

  return (
    <>
      <Helmet>
        <title>{metaTitle || post.title} - quy.bq</title>
        <meta name="description" content={metaDescription || content?.substring(0, 160)} />
        <meta name="keywords" content={`${categoryName}, quy.bq, blog, analysis`} />
        <link rel="canonical" href={`${window.location.origin}/posts/${post.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={metaTitle || post.title} />
        <meta property="og:description" content={metaDescription || content?.substring(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${window.location.origin}/posts/${post.slug}`} />
        {post.featured_image_url && (
          <meta property="og:image" content={post.featured_image_url} />
        )}
        <meta property="og:site_name" content="quy.bq" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle || post.title} />
        <meta name="twitter:description" content={metaDescription || content?.substring(0, 160)} />
        {post.featured_image_url && (
          <meta name="twitter:image" content={post.featured_image_url} />
        )}
        
        {/* JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": metaDescription || content?.substring(0, 160),
            "image": post.featured_image_url,
            "author": {
              "@type": "Person",
              "name": "quy.bq"
            },
            "publisher": {
              "@type": "Organization",
              "name": "quy.bq",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/favicon.ico`
              }
            },
            "datePublished": post.published_at,
            "dateModified": post.updated_at,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${window.location.origin}/posts/${post.slug}`
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-content py-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <a href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {language === 'vi' ? 'Quay lại trang chủ' : 'Back to home'}
            </a>
          </Button>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <article className="flex-1 max-w-4xl">
              {/* Featured Image */}
              {post.featured_image_url && (
                <div className="mb-8">
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Article Header */}
              <header className="mb-8">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
                    {categoryName}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6 leading-tight">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>quy.bq</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{publishedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.read_time} {language === 'vi' ? 'phút đọc' : 'min read'}</span>
                  </div>
                </div>
              </header>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none mb-12">
                {content && <MarkdownRenderer content={content} />}
              </div>

              {/* Comments Section */}
              <CommentSection postId={post.id} />
            </article>

            {/* Sidebar with TOC */}
            {showTOC && content && (
              <aside className="w-80">
                <TableOfContents content={content} />
              </aside>
            )}
          </div>
        </div>
      </div>
    </>
  );
}