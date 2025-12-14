import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  useFragrances, 
  useCreateFragrance, 
  useUpdateFragrance, 
  useToggleFragrance, 
  useDeleteFragrance 
} from '@/hooks/useFragrances';
import { Fragrance, CreateFragranceData } from '@/services/fragrance.service';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function Fragrances() {
  const { data: fragrances, isLoading } = useFragrances();
  const createMutation = useCreateFragrance();
  const updateMutation = useUpdateFragrance();
  const toggleMutation = useToggleFragrance();
  const deleteMutation = useDeleteFragrance();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFragrance, setEditingFragrance] = useState<Fragrance | null>(null);
  const [formData, setFormData] = useState<CreateFragranceData>({
    name: '',
    description: '',
    active: true,
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', active: true });
    setEditingFragrance(null);
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'Nome é obrigatório', variant: 'destructive' });
      return;
    }
    await createMutation.mutateAsync(formData);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleUpdate = async () => {
    if (!editingFragrance || !formData.name.trim()) return;
    await updateMutation.mutateAsync({ id: editingFragrance.id, data: formData });
    setEditingFragrance(null);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta fragrância?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const openEditDialog = (fragrance: Fragrance) => {
    setEditingFragrance(fragrance);
    setFormData({
      name: fragrance.name,
      description: fragrance.description,
      active: fragrance.active,
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
          <h1 className="font-display text-3xl font-bold">Fragrâncias</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas fragrâncias disponíveis</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Fragrância
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Fragrância</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Lavanda"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva a fragrância..."
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
                Criar Fragrância
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Fragrâncias</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fragrances?.data?.length ? (
                fragrances.data.map((fragrance) => (
                  <TableRow key={fragrance.id}>
                    <TableCell className="font-medium">{fragrance.name}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {fragrance.description || '-'}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={fragrance.active}
                        onCheckedChange={() => toggleMutation.mutate(fragrance.id)}
                        disabled={toggleMutation.isPending}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog open={editingFragrance?.id === fragrance.id} onOpenChange={(open) => !open && resetForm()}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openEditDialog(fragrance)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Fragrância</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Nome</Label>
                                <Input
                                  id="edit-name"
                                  value={formData.name}
                                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-description">Descrição</Label>
                                <Textarea
                                  id="edit-description"
                                  value={formData.description}
                                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                          onClick={() => handleDelete(fragrance.id)}
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
                    Nenhuma fragrância cadastrada
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
