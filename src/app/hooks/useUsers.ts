import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsersWithCVs, User, UserWithCVs, updateUser, UpdateUserData, validateToken, getAuthToken } from '../api/services';

export const USERS_QUERY_KEY = ['users'];

export const useUsers = () => {
  return useQuery<UserWithCVs[]>({
    queryKey: USERS_QUERY_KEY,
    queryFn: fetchUsersWithCVs,
    staleTime: 5 * 60 * 1000,
    enabled: typeof window !== 'undefined' && validateToken(),
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: boolean }) => {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('فشل تحديث الحالة');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });

      if (!response.ok) throw new Error('فشل تحديث الدور');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, userData }: { userId: string; userData: UpdateUserData }) => {
      return await updateUser(userId, userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
    onError: (error: Error) => {
      console.error('خطأ في تعديل المستخدم:', error);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل حذف المستخدم');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};

export const useRefreshUsers = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
  };
};
