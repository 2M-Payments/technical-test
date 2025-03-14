import axios from "axios";

const API_URL = "http://localhost:3000/api/musicos";

export const getMusicos = async (pagina: number = 1, limite: number = 10) => {
  const response = await axios.get(`${API_URL}?pagina=${pagina}&limite=${limite}`);
  return response.data;
};

export const getMusicoById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const getMusicosByInstrumento = async (instrumento: string) => {
  const response = await axios.get(`${API_URL}/instrumento/${instrumento}`);
  return response.data;
};

export const getMusicosByInstrumentoSecundario = async (instrumento: string) => {
  const response = await axios.get(`${API_URL}/instrumento-secundario/${instrumento}`);
  return response.data;
};

export const createMusico = async (musico: any) => {
  const response = await axios.post(API_URL, musico);
  return response.data;
};

export const createMusicosEmLote = async (musicos: any[]) => {
  const response = await axios.post(`${API_URL}/lote`, { musicos });
  return response.data;
};

export const updateMusico = async (id: string, musico: any) => {
  const response = await axios.put(`${API_URL}/${id}`, musico);
  return response.data;
};

export const deleteMusico = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const deleteMusicosEmLote = async (ids: string[]) => {
  await axios.delete(`${API_URL}/lote`, { data: { ids } });
};

export const deleteTodosMusicos = async () => {
  await axios.delete(API_URL);
};
