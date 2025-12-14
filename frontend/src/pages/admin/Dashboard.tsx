import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrderStats } from '@/hooks/useOrders';
import { useFragrances } from '@/hooks/useFragrances';
import { Package, DollarSign,  Loader2 } from 'lucide-react';

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useOrderStats();
  const { data: fragrances, isLoading: fragrancesLoading } = useFragrances();

  const isLoading = statsLoading || fragrancesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  const totalRevenue =
  typeof stats?.totalRevenue === 'number'
    ? stats.totalRevenue
    : 0;

const activeFragrances = Array.isArray(fragrances.data)
  ? fragrances.data.filter(f => f.active).length
  : 0;


  const statCards = [
    {
  title: 'Receita Total',
  value: `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`,
  icon: DollarSign,
  color: 'from-green-500/20 to-green-600/20',
},
{
  title: 'Fragrâncias Ativas',
  value: activeFragrances,
  icon: Package,
  color: 'from-purple-500/20 to-purple-600/20',
},

  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral do seu negócio</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="group overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <CardHeader className="relative flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="relative">
              <p className="text-3xl font-display font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Nenhum pedido recente para exibir.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fragrâncias Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Dados de fragrâncias populares aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
