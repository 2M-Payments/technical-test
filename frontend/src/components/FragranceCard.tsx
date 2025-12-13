import { Card, CardContent } from '@/components/ui/card';
import { Fragrance } from '@/services/fragrance.service';
import { Droplets } from 'lucide-react';

interface FragranceCardProps {
  fragrance: Fragrance;
}

const fragranceColors: Record<string, string> = {
  'lavanda': 'from-purple-400/20 to-purple-600/20',
  'vanilla': 'from-amber-300/20 to-amber-500/20',
  'baunilha': 'from-amber-300/20 to-amber-500/20',
  'citrus': 'from-yellow-400/20 to-orange-500/20',
  'limão': 'from-yellow-400/20 to-yellow-600/20',
  'laranja': 'from-orange-400/20 to-orange-600/20',
  'menta': 'from-emerald-400/20 to-emerald-600/20',
  'eucalipto': 'from-green-400/20 to-green-600/20',
  'pinho': 'from-green-600/20 to-green-800/20',
  'rosa': 'from-pink-400/20 to-pink-600/20',
  'jasmin': 'from-yellow-200/20 to-pink-300/20',
  'oceano': 'from-blue-400/20 to-blue-600/20',
  'carro novo': 'from-slate-400/20 to-slate-600/20',
  'couro': 'from-amber-700/20 to-amber-900/20',
  'café': 'from-amber-800/20 to-amber-950/20',
  'cereja': 'from-red-400/20 to-red-600/20',
  'morango': 'from-red-400/20 to-pink-500/20',
  'coco': 'from-amber-100/20 to-amber-300/20',
  'madeira': 'from-amber-600/20 to-amber-800/20',
};

function getGradientColor(name: string): string {
  const lowerName = name.toLowerCase();
  for (const [key, value] of Object.entries(fragranceColors)) {
    if (lowerName.includes(key)) return value;
  }
  return 'from-primary/20 to-primary/10';
}

export function FragranceCard({ fragrance }: FragranceCardProps) {
  const gradient = getGradientColor(fragrance.name);

  return (
    <Card variant="elevated" className="group overflow-hidden">
      <div className={`h-32 bg-gradient-to-br ${gradient} flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-soft group-hover:shadow-glow transition-all duration-300 animate-float">
          <Droplets className="h-8 w-8 text-primary" />
        </div>
      </div>
      <CardContent className="p-4 text-center">
        <h3 className="font-display text-lg font-semibold">{fragrance.name}</h3>
        {fragrance.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {fragrance.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
