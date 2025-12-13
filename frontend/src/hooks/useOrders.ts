import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, CreateOrderData, Order } from '@/services/order.service';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export function useOrders() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAll(token!),
    enabled: !!token,
  });
}

export function useOrder(id: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderService.getById(id, token!),
    enabled: !!id && !!token,
  });
}

export function useOrderStats() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['orders', 'stats'],
    queryFn: () => orderService.getStats(token!),
    enabled: !!token,
  });
}

export function useCreateOrder() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderData) => orderService.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({ title: 'Pedido criado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao criar pedido', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateOrder() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateOrderData & { status: Order['status'] }> }) =>
      orderService.update(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({ title: 'Pedido atualizado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar pedido', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteOrder() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({ title: 'Pedido excluído com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao excluir pedido', description: error.message, variant: 'destructive' });
    },
  });
}
