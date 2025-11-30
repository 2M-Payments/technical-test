import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Control } from "react-hook-form";
import type { ProductFormData } from "@/schemas/product.schema";

type ProductFormFieldsProps = {
  control: Control<ProductFormData>;
  index: number;
};

export function ProductFormFields({ control, index }: ProductFormFieldsProps) {
  return (
    <div className="space-y-4 p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
      <FormField
        control={control}
        name={`products.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                label="Nome"
                placeholder="Nome do produto"
                className="border-zinc-700 bg-zinc-800/50 text-zinc-100"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`products.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                label="Descrição"
                placeholder="Descrição do produto"
                className="border-zinc-700 bg-zinc-800/50 text-zinc-100 min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`products.${index}.quantity`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label="Quantidade"
                  type="number"
                  placeholder="0"
                  className="border-zinc-700 bg-zinc-800/50 text-zinc-100"
                  {...field}
                  value={field.value as number}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`products.${index}.price`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  label="Preço"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="border-zinc-700 bg-zinc-800/50 text-zinc-100"
                  {...field}
                  value={field.value as number}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

