import { Router } from "express";
import asyncHandler from "express-async-handler";
import { container } from "../config/container";
import { MusicoController } from "../controllers/MusicoController";

const router = Router();
const musicoController = container.resolve(MusicoController);

router.post("/musicos", asyncHandler(musicoController.criar.bind(musicoController)));
router.get("/musicos", asyncHandler(musicoController.listar.bind(musicoController)));
router.get("/musicos/:id", asyncHandler(musicoController.buscarPorId.bind(musicoController)));
router.put("/musicos/:id", asyncHandler(musicoController.atualizar.bind(musicoController)));
router.delete("/musicos/:id", asyncHandler(musicoController.deletar.bind(musicoController)));

export { router };
