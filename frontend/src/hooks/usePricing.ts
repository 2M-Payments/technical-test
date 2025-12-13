import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pricingService, CreatePricingConfigData } from '@/services/pricing.service';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export function usePricingConfigs() {
  return useQuery({
    queryKey: ['pricing'],
    queryFn: () => pricingService.getAll(),
  });
}

export function useActivePricing() {
  return useQuery({
    queryKey: ['pricing', 'active'],
    queryFn: () => pricingService.getActive(),
  });
}

export function usePricingTable() {
  return useQuery({
    queryKey: ['pricing', 'table'],
    queryFn: () => pricingService.getPricingTable(),
  });
}

export function useCalculatePrice(quantity: number) {
  return useQuery({
    queryKey: ['pricing', 'calculate', quantity],
    queryFn: () => pricingService.calculatePrice(quantity),
    enabled: quantity > 0,
  });
}

export function useCreatePricing() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePricingConfigData) => pricingService.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing'] });
      toast({ title: 'Configuração de preço criada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao criar configuração', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdatePricing() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePricingConfigData> }) =>
      pricingService.update(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing'] });
      toast({ title: 'Configuração de preço atualizada!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar configuração', description: error.message, variant: 'destructive' });
    },
  });
}

export function useTogglePricing() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pricingService.toggleActive(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing'] });
    },
  });
}

export function useDeletePricing() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pricingService.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing'] });
      toast({ title: 'Configuração de preço excluída!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao excluir configuração', description: error.message, variant: 'destructive' });
    },
  });
}
