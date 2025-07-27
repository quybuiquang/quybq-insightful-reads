import { useState } from 'react';
import { Moon, Sun, Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';

const categories = [
  { name: 'Chính trị & Quan hệ quốc tế', href: '/politics' },
  { name: 'Kinh tế & Thị trường', href: '/economics' },
  { name: 'Văn hóa & Đời sống', href: '/culture' },
  { name: 'Khoa học & Công nghệ', href: '/science' },
  { name: 'Môi trường & Phát triển bền vững', href: '/environment' },
  { name: 'Phân tích & Bình luận', href: '/analysis' },
  { name: 'Tâm sự & Góc nhìn', href: '/thoughts' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('vi');
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-content">
        <div className="flex items-center justify-between h-header">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-heading font-bold text-foreground hover:text-primary transition-colors">
              quy.bq
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {categories.slice(0, 4).map((category) => (
              <a
                key={category.name}
                href={category.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {category.name}
              </a>
            ))}
            <div className="relative group">
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Thêm ↓
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2">
                  {categories.slice(4).map((category) => (
                    <a
                      key={category.name}
                      href={category.href}
                      className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="hidden sm:flex"
            >
              <Globe className="h-4 w-4 mr-1" />
              {language.toUpperCase()}
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border">
            <nav className="py-4 space-y-2">
              {categories.map((category) => (
                <a
                  key={category.name}
                  href={category.href}
                  className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </a>
              ))}
              <div className="flex items-center px-4 py-2 space-x-2 sm:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                >
                  <Globe className="h-4 w-4 mr-1" />
                  {language.toUpperCase()}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}