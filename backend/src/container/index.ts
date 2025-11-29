import { container } from "tsyringe";
import { UserRepository } from "@/repositories/user.repository";
import { ProductRepository } from "@/repositories/product.repository";

container.registerSingleton<UserRepository>("UserRepository", UserRepository);
container.registerSingleton<ProductRepository>("ProductRepository", ProductRepository);
