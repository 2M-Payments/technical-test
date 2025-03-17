import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { MusicoService } from "../services/MusicoService";

@injectable()
export class MusicoController {
    constructor(@inject("MusicoService") private service: MusicoService) { }

    public async criar(req: Request, res: Response): Promise<void> {
        try {
            const novoMusico = await this.service.criarMusico(req.body);
            res.status(201).json(novoMusico);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    public async listar(req: Request, res: Response): Promise<void> {
        try {
            const { pagina = 1, limite = 10 } = req.query;
            const musicos = await this.service.listarMusicos(Number(pagina), Number(limite));
            res.json(musicos);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    public async buscarPorId(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const musico = await this.service.buscarMusicoPorId(Number(id));
            if (!musico) {
                res.status(404).json({ error: "Músico não encontrado" });
                return;
            }
            res.json(musico);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    public async atualizar(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const dados = req.body;
            const musicoAtualizado = await this.service.atualizarMusico(Number(id), dados);
            res.json(musicoAtualizado);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    public async deletar(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.service.deletarMusico(Number(id));
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
}
