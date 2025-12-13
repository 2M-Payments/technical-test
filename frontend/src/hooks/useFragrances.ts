import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fragranceService, CreateFragranceData } from '@/services/fragrance.service';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export function useFragrances() {
  return useQuery({
    queryKey: ['fragrances'],
    queryFn: () => fragranceService.getAll(),
  });
}

export function useActiveFragrances() {
  return useQuery({
    queryKey: ['fragrances', 'active'],
    queryFn: () => fragranceService.getActive(),
  });
}

export function useFragrance(id: string) {
  return useQuery({
    queryKey: ['fragrances', id],
    queryFn: () => fragranceService.getById(id),
    enabled: !!id,
  });
}

export function useCreateFragrance() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFragranceData) => fragranceService.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fragrances'] });
      toast({ title: 'Fragrância criada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao criar fragrância', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateFragrance() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateFragranceData> }) =>
      fragranceService.update(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fragrances'] });
      toast({ title: 'Fragrância atualizada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar fragrância', description: error.message, variant: 'destructive' });
    },
  });
}

export function useToggleFragrance() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fragranceService.toggleActive(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fragrances'] });
    },
  });
}

export function useDeleteFragrance() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fragranceService.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fragrances'] });
      toast({ title: 'Fragrância excluída com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao excluir fragrância', description: error.message, variant: 'destructive' });
    },
  });
}
