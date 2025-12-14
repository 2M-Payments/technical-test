import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FragranceCard } from '@/components/FragranceCard';
import { PricingTable } from '@/components/PricingTable';
import { useActiveFragrances } from '@/hooks/useFragrances';
import { Car, Sparkles, Truck, Shield, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { data: fragrances, isLoading } = useActiveFragrances();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 hero-gradient opacity-10" />
        <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm text-accent-foreground mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span>Aromas exclusivos para seu carro</span>
            </div>
            
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animate-slide-up">
              Transforme cada viagem em uma 
              <span className="text-gradient"> experiência sensorial</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Aromatizadores personalizados com fragrâncias premium para deixar seu veículo sempre agradável e acolhedor.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="#fragrances">
                <Button variant="hero" size="xl">
                  Ver Fragrâncias
                </Button>
              </Link>
              <Link to="#pricing">
                <Button variant="outline" size="xl">
                  Tabela de Preços
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card/50">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-background shadow-soft">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl hero-gradient">
                <Car className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg">Personalizado</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Escolha a fragrância e design que combina com você
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-background shadow-soft">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl hero-gradient">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg">Qualidade Premium</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Fragrâncias importadas de alta durabilidade
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-background shadow-soft">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl hero-gradient">
                <Truck className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg">Entrega Rápida</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Enviamos para todo o Brasil com rapidez
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fragrances Section */}
      <section id="fragrances" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Nossas <span className="text-gradient">Fragrâncias</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Escolha entre nossa seleção exclusiva de aromas que vão transformar seu carro em um ambiente único.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : fragrances?.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {fragrances.map((fragrance) => (
                <FragranceCard key={fragrance.id} fragrance={fragrance} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma fragrância disponível no momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-card/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Tabela de <span className="text-gradient">Preços</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Quanto mais você compra, mais desconto você ganha! Confira nossa tabela de preços por quantidade.
            </p>
          </div>

          <PricingTable />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl hero-gradient p-12 text-center">
            <div className="absolute top-0 left-1/4 h-32 w-32 rounded-full bg-background/10 blur-2xl" />
            <div className="absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-background/10 blur-2xl" />
            
            <div className="relative">
              <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
                Pronto para começar?
              </h2>
              <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
                Entre em contato conosco pelo WhatsApp e faça seu pedido personalizado!
              </p>
              <Button 
                variant="glass" 
                size="xl" 
                className="mt-8 bg-background/20 hover:bg-background/30 text-primary-foreground border-primary-foreground/20"
              >
                Fazer Pedido via WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
