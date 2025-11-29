import { container } from "tsyringe";
import { UserRepository } from "@/repositories/user.repository";

container.registerSingleton<UserRepository>("UserRepository", UserRepository);
