import { useNavigate } from "react-router-dom";
import { LogOutIcon, PackageIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="border-b border-zinc-800 bg-zinc-900/50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PackageIcon className="size-6 text-primary" />
          <span className="font-semibold text-zinc-100">Produtos</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">{user?.name}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="mt-0 hover:bg-zinc-800/50">
            <LogOutIcon className="size-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}

