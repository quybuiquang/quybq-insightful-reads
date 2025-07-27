import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Post = Tables<'posts'> & {
  categories: Tables<'categories'>;
};

export const usePosts = (status: 'published' | 'all' = 'published') => {
  return useQuery({
    queryKey: ['posts', status],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          *,
          categories (*)
        `)
        .order('published_at', { ascending: false });

      if (status === 'published') {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as Post[];
    },
  });
};

export const usePost = (slug: string) => {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories (*)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        throw error;
      }

      return data as Post;
    },
    enabled: !!slug,
  });
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: ['posts', 'search', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) {
        return [];
      }

      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories (*)
        `)
        .eq('status', 'published')
        .or(`title.ilike.%${searchTerm}%,content_vi.ilike.%${searchTerm}%,content_en.ilike.%${searchTerm}%`)
        .order('published_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      return data as Post[];
    },
    enabled: !!searchTerm.trim(),
  });
};