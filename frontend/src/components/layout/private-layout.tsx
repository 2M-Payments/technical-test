import { Outlet } from "react-router-dom";
import { Header } from "./header";

export function PrivateLayout() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

