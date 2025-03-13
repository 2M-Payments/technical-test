import { injectable } from "inversify";
import { MusicoRepository } from "../repositories/MusicoRepository";
import { Musico } from "../entities/Musico";

@injectable()
export class MusicoService {
    constructor(private musicoRepo: MusicoRepository) { }

    async criarMusico(musico: Musico) {
        return this.musicoRepo.criar(musico);
    }

    async listarMusicos(pagina: number, limite: number) {
        return this.musicoRepo.listarTodos(pagina, limite);
    }

    async buscarMusicoPorId(id: number) {
        return this.musicoRepo.buscarPorId(id.toString());
    }

    async atualizarMusico(id: number, dados: Partial<Musico>) {
        return this.musicoRepo.atualizar(id.toString(), dados);
    }

    async deletarMusico(id: number) {
        return this.musicoRepo.deletar(id.toString());
    }
}
