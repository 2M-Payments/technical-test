import axios from "axios";

const API_URL = "http://localhost:3000/api/musicos";

export const getMusicos = async (pagina: number = 1, limite: number = 10) => {
  try {
    const response = await axios.get(`${API_URL}?pagina=${pagina}&limite=${limite}`);
    return response?.data || []; 
  } catch (error) {
    console.error("Erro ao buscar músicos:", error);
    return [];
  }
};

export const getMusicoById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response?.data || null;
  } catch (error) {
    console.error(`Erro ao buscar músico com ID ${id}:`, error);
    return null;
  }
};

export const createMusico = async (musicoData: any) => {
  try {
    const response = await axios.post(API_URL, musicoData);
    return response?.data || null;
  } catch (error) {
    console.error("Erro ao criar músico:", error);
    return null;
  }
};

export const updateMusico = async (id: string, musicoData: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, musicoData);
    return response?.data || null;
  } catch (error) {
    console.error(`Erro ao atualizar músico com ID ${id}:`, error);
    return null;
  }
};

export const deleteMusico = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar músico com ID ${id}:`, error);
  }
};

export const deleteMusicosEmLote = async (ids: string[]) => {
  try {
    await axios.post(`${API_URL}/delete-lote`, { ids });
  } catch (error) {
    console.error("Erro ao deletar músicos em lote:", error);
  }
};

export const deleteTodosMusicos = async () => {
  try {
    await axios.delete(`${API_URL}/todos`);
  } catch (error) {
    console.error("Erro ao deletar todos os músicos:", error);
  }
};
