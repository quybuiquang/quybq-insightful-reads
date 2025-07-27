import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type AdminPost = Tables<'posts'> & {
  categories: Tables<'categories'>;
};

export const useAdminPost = (postId: string | null) => {
  return useQuery({
    queryKey: ['admin-post', postId],
    queryFn: async () => {
      if (!postId) return null;
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories (*)
        `)
        .eq('id', postId)
        .single();

      if (error) {
        throw error;
      }

      return data as AdminPost;
    },
    enabled: !!postId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: TablesInsert<'posts'>) => {
      const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'posts'> & { id: string }) => {
      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-post'] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};