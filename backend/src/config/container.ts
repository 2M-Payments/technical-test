import "reflect-metadata";
import { container } from "tsyringe";
import { MusicoRepository } from "../repositories/MusicoRepository";
import { MusicoService } from "../services/MusicoService";

container.registerSingleton<MusicoRepository>("MusicoRepository", MusicoRepository);
container.registerSingleton<MusicoService>("MusicoService", MusicoService);

export { container };
