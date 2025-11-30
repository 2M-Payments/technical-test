import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { loginSchema, type LoginFormData } from "@/schemas/auth.schema";
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

export function Login() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormData) {
    console.log(data);
  }

  return (
    <Card className="w-full max-w-md border-zinc-700 bg-zinc-900/80 backdrop-blur-sm m-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-zinc-100">
          Entrar
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Acesse sua conta para continuar
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label="E-mail"
                      type="email"
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
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">
              Entrar
            </Button>
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-primary/80 underline-offset-4 hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
