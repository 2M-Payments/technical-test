import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePricingTable } from '@/hooks/usePricing';
import { Loader2, Package } from 'lucide-react';

export function PricingTable() {
  const { data: pricingTable, isLoading, error } = usePricingTable();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !pricingTable?.length) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <p className="text-muted-foreground">Tabela de preços indisponível no momento.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {pricingTable.map((item, index) => (
        <Card 
          key={index} 
          variant="elevated"
          className="group relative overflow-hidden"
        >
          <div className="absolute inset-0 hero-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
          <CardHeader className="text-center pb-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent mb-2">
              <Package className="h-6 w-6 text-accent-foreground" />
            </div>
            <CardTitle className="text-lg">{item.range}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-display font-bold text-primary">
              R$ {item.pricePerUnit.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-sm text-muted-foreground mt-1">por unidade</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
