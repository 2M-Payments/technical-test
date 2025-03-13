import { injectable } from "tsyringe";
import { MusicoRepository } from "../repositories/MusicoRepository";

@injectable()
export class MusicoService {
  constructor(private musicoRepo: MusicoRepository) {}

  async criarMusico(dados: any) {
    return this.musicoRepo.criar(dados);
  }

  async listarMusicos(pagina: number, limite: number) {
    return this.musicoRepo.listarTodos(pagina, limite);
  }

  async buscarMusicoPorId(id: number) {
    return this.musicoRepo.buscarPorId(id.toString());
  }

  async atualizarMusico(id: number, dados: any) {
    return this.musicoRepo.atualizar(id.toString(), dados);
  }

  async deletarMusico(id: number) {
    return this.musicoRepo.deletar(id.toString());
  }
}
