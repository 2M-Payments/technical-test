import axios from "axios";
import { getMusicos, getMusicoById, createMusico, updateMusico, deleteMusico } from "../services/musicoService";

jest.mock("axios");

describe("Serviços de Músico", () => {
  it("Deve buscar a lista de músicos", async () => {
    const mockData = [{ id: "1", nome: "João", instrumentoPrincipal: "Guitarra" }];
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    const response = await getMusicos(1,100);
    expect(response).toEqual(mockData);
  });

  it("Deve buscar um músico pelo ID", async () => {
    const mockData = { id: "1", nome: "Carlos", instrumentoPrincipal: "Bateria" };
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    const response = await getMusicoById("1");
    expect(response).toEqual(mockData);
  });

  it("Deve criar um novo músico", async () => {
    const novoMusico = { nome: "Carlos", instrumentoPrincipal: "Bateria" };
    (axios.post as jest.Mock).mockResolvedValue({ data: { id: "2", ...novoMusico } });

    const response = await createMusico(novoMusico);
    expect(response).toMatchObject(novoMusico);
  });

  it("Deve atualizar um músico existente", async () => {
    const updatedMusico = { nome: "Carlos Silva", instrumentoPrincipal: "Bateria" };
    (axios.put as jest.Mock).mockResolvedValue({ data: { id: "2", ...updatedMusico } });

    const response = await updateMusico("2", updatedMusico);
    expect(response).toMatchObject(updatedMusico);
  });

  it("Deve deletar um músico", async () => {
    (axios.delete as jest.Mock).mockResolvedValue({});

    await expect(deleteMusico("2")).resolves.toBeUndefined();
  });
});
