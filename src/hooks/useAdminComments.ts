import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type AdminComment = Tables<'comments'> & {
  posts: { title: string } | null;
};

export const useAdminComments = () => {
  return useQuery({
    queryKey: ['admin-comments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          posts (title)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as AdminComment[];
    },
  });
};

export const useUpdateCommentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, status }: { commentId: string; status: string }) => {
      const { data, error } = await supabase
        .from('comments')
        .update({ status })
        .eq('id', commentId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};