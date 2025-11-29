import { Router } from "express";
import { ProductController } from "@/controllers/product.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { validateRequest } from "@/middlewares/validate-request.middleware";
import {
  createProductSchema,
  deleteManyProductsSchema,
  updateProductSchema,
  listProductsQuerySchema,
} from "@/schemas/product.schema";

const productRoutes = Router();
const productController = new ProductController();

productRoutes.use(authenticate);

productRoutes.post(
  "/",
  validateRequest(createProductSchema),
  productController.create
);

productRoutes.get("/", validateRequest(listProductsQuerySchema, "query"), productController.list);
productRoutes.get("/:id", productController.findOne);

productRoutes.patch(
  "/:id",
  validateRequest(updateProductSchema),
  productController.update
);

productRoutes.delete("/all", productController.deleteAll);
productRoutes.delete("/", validateRequest(deleteManyProductsSchema), productController.deleteMany);
productRoutes.delete("/:id", productController.delete);

export { productRoutes };
