import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  usePricingConfigs, 
  useCreatePricing, 
  useUpdatePricing, 
  useTogglePricing, 
  useDeletePricing 
} from '@/hooks/usePricing';
import { PricingConfig, CreatePricingConfigData } from '@/services/pricing.service';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function Pricing() {
  const { data: configs, isLoading } = usePricingConfigs();
  const createMutation = useCreatePricing();
  const updateMutation = useUpdatePricing();
  const toggleMutation = useTogglePricing();
  const deleteMutation = useDeletePricing();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<PricingConfig | null>(null);
  const [formData, setFormData] = useState<CreatePricingConfigData>({
    minQuantity: 1,
    maxQuantity: 10,
    unitPrice: 0,
    active: true,
  });

  const resetForm = () => {
    setFormData({ minQuantity: 1, maxQuantity: 10, unitPrice: 0, active: true });
    setEditingConfig(null);
  };

  const handleCreate = async () => {
    if (formData.minQuantity >= formData.maxQuantity) {
      toast({ title: 'Quantidade mínima deve ser menor que a máxima', variant: 'destructive' });
      return;
    }
    if (formData.unitPrice <= 0) {
      toast({ title: 'Preço deve ser maior que zero', variant: 'destructive' });
      return;
    }
    await createMutation.mutateAsync(formData);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleUpdate = async () => {
    if (!editingConfig) return;
    await updateMutation.mutateAsync({ id: editingConfig.id, data: formData });
    setEditingConfig(null);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta faixa de preço?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const openEditDialog = (config: PricingConfig) => {
    setEditingConfig(config);
    setFormData({
      minQuantity: config.minQuantity,
      maxQuantity: config.maxQuantity,
      unitPrice: config.unitPrice,
      active: config.active,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Tabela de Preços</h1>
          <p className="text-muted-foreground mt-1">Configure os preços por quantidade</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Faixa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Faixa de Preço</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minQty">Quantidade Mínima</Label>
                  <Input
                    id="minQty"
                    type="number"
                    min={1}
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxQty">Quantidade Máxima</Label>
                  <Input
                    id="maxQty"
                    type="number"
                    min={1}
                    value={formData.maxQuantity}
                    onChange={(e) => setFormData({ ...formData, maxQuantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço por Unidade (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step={0.01}
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label>Ativo</Label>
              </div>
              <Button 
                onClick={handleCreate} 
                className="w-full" 
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Criar Faixa de Preço
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações de Preço</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faixa de Quantidade</TableHead>
                <TableHead>Preço por Unidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs?.data.length ? (
                configs?.data.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">
                      {config.minQuantity} - {config.maxQuantity} unidades
                    </TableCell>
                    <TableCell>
                      R$ {config.unitPrice.toFixed(2).replace('.', ',')}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={config.active}
                        onCheckedChange={() => toggleMutation.mutate(config.id)}
                        disabled={toggleMutation.isPending}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog open={editingConfig?.id === config.id} onOpenChange={(open) => !open && resetForm()}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openEditDialog(config)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Faixa de Preço</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Quantidade Mínima</Label>
                                  <Input
                                    type="number"
                                    min={1}
                                    value={formData.minQuantity}
                                    onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) || 1 })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Quantidade Máxima</Label>
                                  <Input
                                    type="number"
                                    min={1}
                                    value={formData.maxQuantity}
                                    onChange={(e) => setFormData({ ...formData, maxQuantity: parseInt(e.target.value) || 1 })}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Preço por Unidade (R$)</Label>
                                <Input
                                  type="number"
                                  min={0}
                                  step={0.01}
                                  value={formData.unitPrice}
                                  onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={formData.active}
                                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                                />
                                <Label>Ativo</Label>
                              </div>
                              <Button 
                                onClick={handleUpdate} 
                                className="w-full"
                                disabled={updateMutation.isPending}
                              >
                                {updateMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Salvar Alterações
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(config.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Nenhuma configuração de preço cadastrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
