import { Repository } from "typeorm";
import { Musico } from "../entities/Musico";
import { AppDataSource } from "../config/database";

export class MusicoRepository {
  private repo: Repository<Musico>;

  constructor() {
    this.repo = AppDataSource.getRepository(Musico);
  }

  async criar(musico: Musico) {
    return this.repo.save(musico);
  }

  async listarTodos(pagina: number, limite: number) {
    return this.repo.find({
      skip: (pagina - 1) * limite,
      take: limite,
    });
  }

  async buscarPorId(id: string) {
    return this.repo.findOneBy({ id });
  }

  async atualizar(id: string, dados: Partial<Musico>) {
    await this.repo.update(id, dados);
    return this.buscarPorId(id);
  }

  async deletar(id: string) {
    return this.repo.delete(id);
  }
}
