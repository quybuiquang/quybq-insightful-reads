-- Create categories table first (referenced by posts)
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_vi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Categories policies - readable by everyone
CREATE POLICY "select_all_categories" 
ON public.categories 
FOR SELECT 
USING (true);

-- Only authenticated users (admins) can manage categories
CREATE POLICY "manage_categories" 
ON public.categories 
FOR ALL 
USING (auth.uid() IS NOT NULL) 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content_vi TEXT,
  content_en TEXT,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  featured_image_url TEXT,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  meta_title_vi TEXT,
  meta_description_vi TEXT,
  meta_title_en TEXT,
  meta_description_en TEXT,
  read_time INTEGER DEFAULT 0
);

-- Enable RLS on posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "select_published_posts" 
ON public.posts 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "manage_own_posts" 
ON public.posts 
FOR ALL 
USING (auth.uid() = author_id) 
WITH CHECK (auth.uid() = author_id);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_name TEXT,
  author_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam'))
);

-- Enable RLS on comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "select_approved_comments" 
ON public.comments 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "insert_comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated users (admins) can manage comments
CREATE POLICY "manage_comments" 
ON public.comments 
FOR UPDATE 
USING (auth.uid() IS NOT NULL) 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog_images', 'blog_images', true);

-- Storage policies for blog images
CREATE POLICY "Public read access for blog images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog_images');

CREATE POLICY "Authenticated users can upload blog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'blog_images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own uploaded images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'blog_images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own uploaded images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'blog_images' AND auth.uid() IS NOT NULL);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for posts updated_at
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (name_vi, name_en, slug) VALUES
('Chính trị & Quan hệ quốc tế', 'Politics & International Relations', 'politics-international'),
('Kinh tế & Thị trường', 'Economics & Markets', 'economics-markets'),
('Văn hóa & Đời sống', 'Culture & Lifestyle', 'culture-lifestyle'),
('Khoa học & Công nghệ', 'Science & Technology', 'science-technology'),
('Môi trường & Phát triển bền vững', 'Environment & Sustainability', 'environment-sustainability'),
('Phân tích & Bình luận', 'Analysis & Commentary', 'analysis-commentary'),
('Tâm sự & Góc nhìn', 'Personal Thoughts & Perspectives', 'thoughts-perspectives');