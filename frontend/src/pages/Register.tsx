import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { registerSchema, type RegisterFormData } from "@/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export function Register() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: RegisterFormData) {
    console.log(data);
  }

  return (
    <Card className="w-full max-w-md border-zinc-700 bg-zinc-900/80 backdrop-blur-sm m-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-zinc-100">
          Criar conta
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Preencha os dados para se cadastrar
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label="Nome"
                      type="text"
                      placeholder="Seu nome completo"
                      className="border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      label="E-mail"
                      placeholder="seu@email.com"
                      className="border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      label="Senha"
                      placeholder="••••••••"
                      className="border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      label="Confirmar senha"
                      placeholder="••••••••"
                      className="border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">
              Cadastrar
            </Button>
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 hover:underline"
              >
                Entrar
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
