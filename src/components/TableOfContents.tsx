import { useEffect, useState } from 'react';
import { List } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const { language } = useLanguage();

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      items.push({ id, text, level });
    }

    setTocItems(items);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    tocItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocItems]);

  if (tocItems.length === 0) {
    return null;
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-24 bg-card rounded-lg border border-border p-6">
      <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center">
        <List className="h-5 w-5 mr-2" />
        {language === 'vi' ? 'Mục lục' : 'Table of Contents'}
      </h3>
      <nav className="space-y-2">
        {tocItems.map(({ id, text, level }) => (
          <button
            key={id}
            onClick={() => scrollToHeading(id)}
            className={`
              block w-full text-left text-sm transition-colors hover:text-primary
              ${activeId === id ? 'text-primary font-medium' : 'text-muted-foreground'}
              ${level === 1 ? 'pl-0' : level === 2 ? 'pl-4' : level === 3 ? 'pl-8' : 'pl-12'}
            `}
          >
            {text}
          </button>
        ))}
      </nav>
    </div>
  );
}