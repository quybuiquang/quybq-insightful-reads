import { Mail, Linkedin, Twitter, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-section">
      <div className="max-w-7xl mx-auto px-content py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
              quy.bq
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              Blog cá nhân chia sẻ phân tích xã hội chuyên sâu, góc nhìn đa chiều về 
              chính trị, kinh tế, văn hóa và những vấn đề quan trọng của thời đại.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" size="sm">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Facebook className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">
              Chuyên mục
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/politics" className="text-muted-foreground hover:text-foreground transition-colors">
                  Chính trị & Quan hệ quốc tế
                </a>
              </li>
              <li>
                <a href="/economics" className="text-muted-foreground hover:text-foreground transition-colors">
                  Kinh tế & Thị trường
                </a>
              </li>
              <li>
                <a href="/culture" className="text-muted-foreground hover:text-foreground transition-colors">
                  Văn hóa & Đời sống
                </a>
              </li>
              <li>
                <a href="/science" className="text-muted-foreground hover:text-foreground transition-colors">
                  Khoa học & Công nghệ
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">
              Liên kết
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Về tác giả
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="/rss" className="text-muted-foreground hover:text-foreground transition-colors">
                  RSS Feed
                </a>
              </li>
              <li>
                <a href="/sitemap" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 quy.bq. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Chính sách bảo mật
              </a>
              <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Điều khoản sử dụng
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}