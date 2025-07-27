import { useEffect } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  useEffect(() => {
    // Add IDs to headings for TOC navigation
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
      if (!heading.id) {
        const text = heading.textContent || '';
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        heading.id = id;
      }
    });
  }, [content]);

  // Simple markdown to HTML conversion
  const renderMarkdown = (text: string) => {
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Line breaks
      .replace(/\n\n/gim, '</p><p>')
      // Wrap in paragraphs
      .replace(/^(.+)$/gim, '<p>$1</p>')
      // Clean up empty paragraphs
      .replace(/<p><\/p>/gim, '')
      // Clean up header paragraphs
      .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/gim, '$1');
  };

  return (
    <div 
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}