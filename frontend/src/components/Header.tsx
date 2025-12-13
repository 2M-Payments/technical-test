import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Car, LogOut, LayoutDashboard } from 'lucide-react';

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl hero-gradient shadow-soft group-hover:shadow-glow transition-shadow duration-300">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">
            Aroma<span className="text-gradient">Drive</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/#fragrances">
            <Button variant="ghost" size="sm">
              Fragrâncias
            </Button>
          </Link>
          <Link to="/#pricing">
            <Button variant="ghost" size="sm">
              Preços
            </Button>
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/admin">
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm">
                Entrar
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
