import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Comment = Tables<'comments'>;

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      return data as Comment[];
    },
    enabled: !!postId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: TablesInsert<'comments'>) => {
      const { data, error } = await supabase
        .from('comments')
        .insert(comment)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      // Invalidate comments query for the specific post
      queryClient.invalidateQueries({ queryKey: ['comments', data.post_id] });
    },
  });
};