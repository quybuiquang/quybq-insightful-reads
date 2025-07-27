import { Clock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  featuredImage?: string | null;
  href: string;
  featured?: boolean;
}

export function ArticleCard({
  title,
  excerpt,
  category,
  readTime,
  publishedAt,
  featuredImage,
  href,
  featured = false,
}: ArticleCardProps) {
  return (
    <article className={`blog-card group ${featured ? 'lg:col-span-2' : ''}`}>
      {featuredImage && (
        <div className="relative overflow-hidden">
          <img
            src={featuredImage}
            alt={title}
            className="featured-image group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
              {category}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {!featuredImage && (
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
              {category}
            </span>
          </div>
        )}
        
        <h3 className={`font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors ${
          featured ? 'text-2xl lg:text-3xl' : 'text-xl'
        }`}>
          <a href={href} className="hover:underline">
            {title}
          </a>
        </h3>
        
        <p className={`text-muted-foreground mb-4 leading-relaxed ${
          featured ? 'text-lg' : 'text-base'
        }`}>
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              quy.bq
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {readTime}
            </div>
            <span>{publishedAt}</span>
          </div>
          
          <Button variant="ghost" size="sm" asChild>
            <a href={href} className="group/btn">
              Đọc tiếp
              <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}