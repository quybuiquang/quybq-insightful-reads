import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { UserPlus, Shield } from 'lucide-react';

export function AdminSetup() {
  const [isCreating, setIsCreating] = useState(false);
  const [email, setEmail] = useState('admin@quybq.com');
  const [password, setPassword] = useState('admin123456');
  const [fullName, setFullName] = useState('Admin User');

  const createAdminUser = async () => {
    setIsCreating(true);
    
    try {
      // Tạo user thông qua Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'admin'
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Cập nhật role thành admin
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', data.user.id);

        if (updateError) {
          console.warn('Could not update user role:', updateError);
        }

        toast.success('Tài khoản admin đã được tạo thành công!');
        toast.info(`Email: ${email} | Password: ${password}`);
      }
    } catch (error: any) {
      if (error.message.includes('User already registered')) {
        toast.info('Tài khoản admin đã tồn tại, bạn có thể đăng nhập ngay!');
      } else {
        toast.error(error.message || 'Có lỗi xảy ra khi tạo tài khoản admin');
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-heading font-bold">Tạo tài khoản Admin</CardTitle>
        <CardDescription>
          Tạo tài khoản admin để quản lý blog
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
            Họ tên
          </label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập họ tên"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email admin"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Mật khẩu
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
          />
        </div>
        
        <Button 
          onClick={createAdminUser} 
          disabled={isCreating}
          className="w-full"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {isCreating ? 'Đang tạo...' : 'Tạo tài khoản Admin'}
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Sau khi tạo, bạn có thể đăng nhập tại:</p>
          <a href="/admin/login" className="text-primary hover:underline">
            /admin/login
          </a>
        </div>
      </CardContent>
    </Card>
  );
}