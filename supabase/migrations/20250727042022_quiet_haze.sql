/*
  # Tạo tài khoản admin và cấu trúc users

  1. Tạo bảng users
    - `id` (uuid, primary key) - liên kết với auth.users
    - `email` (text, unique)
    - `full_name` (text)
    - `role` (text) - admin hoặc user
    - `created_at` (timestamp)

  2. Tạo function để tự động tạo user profile khi đăng ký
  
  3. Tạo tài khoản admin mặc định
    - Email: admin@quybq.com
    - Password: admin123456
    - Role: admin

  4. Cập nhật RLS policies
*/

-- Tạo bảng users để lưu thông tin profile
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies cho users table
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Function để tự động tạo user profile khi có user mới đăng ký
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger để tự động tạo profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Cập nhật foreign key constraint cho posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'posts_author_id_fkey' 
    AND table_name = 'posts'
  ) THEN
    ALTER TABLE posts 
    ADD CONSTRAINT posts_author_id_fkey 
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Tạo admin user (sẽ được tạo thông qua Supabase Auth)
-- Email: admin@quybq.com
-- Password: admin123456
-- Bạn cần tạo user này thông qua Supabase Dashboard hoặc signup form