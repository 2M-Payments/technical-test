import { useEffect } from "react";
import { useForm, useFieldArray, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useModal } from "@/contexts/modal-context";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductQuery,
} from "@/features/products/products-api";
import { productSchema, type SingleProductData, type ProductFormData } from "@/schemas/product.schema";
import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ProductFormFields } from "./product-form-fields";
import { Loader } from "@/components/shared/loader";

const MODAL_NAME = "product";
const defaultProduct: SingleProductData = {
  name: "",
  description: "",
  quantity: 0,
  price: 0,
};

export function ProductModal() {
  const { modal, data, closeModal } = useModal();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const productId = data as string | null;
  const isEditing = !!productId;
  const isLoading = isCreating || isUpdating;
  const isOpen = modal === MODAL_NAME;

  const { data: product, isLoading: isLoadingProduct } = useGetProductQuery(
    productId!,
    { skip: !productId || !isOpen }
  );

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { products: [defaultProduct] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  useEffect(() => {
    if (!isOpen) return;

    if (product) {
      form.reset({
        products: [{
          name: product.name,
          description: product.description || "",
          quantity: product.quantity,
          price: product.price,
        }],
      });
    } else if (!isEditing) {
      form.reset({ products: [defaultProduct] });
    }
  }, [isOpen, product, isEditing, form]);

  async function onSubmit(formData: { products: SingleProductData[] }) {
    try {
      if (isEditing && productId) {
        await updateProduct({
          id: productId,
          data: formData.products[0],
        }).unwrap();
        toast.success("Produto atualizado com sucesso!");
      } else {
        const payload = formData.products.length === 1
          ? formData.products[0]
          : formData.products;

        await createProduct(payload).unwrap();

        const count = formData.products.length;
        toast.success(
          count === 1
            ? "Produto cadastrado com sucesso!"
            : `${count} produtos cadastrados com sucesso!`
        );
      }
      form.reset();
      closeModal();
    } catch {
      toast.error(
        isEditing ? "Erro ao atualizar produto" : "Erro ao cadastrar produto"
      );
    }
  }

  if (!isOpen) return null;

  if (isEditing && isLoadingProduct) {
    return (
      <Modal name={MODAL_NAME} title="Editar produto">
        <Loader />
      </Modal>
    );
  }

  return (
    <Modal
      name={MODAL_NAME}
      title={isEditing ? "Editar produto" : "Cadastrar produto(s)"}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {fields.map((field, index) => (
              <div key={field.id}>
                {fields.length > 1 && (
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-zinc-300">
                      Produto {index + 1}
                    </h3>
                    {!isEditing && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-950/20"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    )}
                  </div>
                )}
                <ProductFormFields control={form.control as Control<ProductFormData>} index={index} />
              </div>
            ))}
          </div>

          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => append(defaultProduct)}
              className="w-full border-zinc-700 hover:bg-zinc-800/50"
            >
              <PlusIcon className="size-4 mr-2" />
              Adicionar mais produto
            </Button>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              className="border-zinc-700"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Salvando..."
                : isEditing
                  ? "Salvar"
                  : fields.length === 1
                    ? "Cadastrar produto"
                    : `Cadastrar ${fields.length} produtos`}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
