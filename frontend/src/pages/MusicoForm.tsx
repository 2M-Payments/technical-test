import React, { useState } from "react";
import { createMusico } from "../services/musicoService";

export const MusicoForm = () => {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    dataNascimento: "",
    instrumentoPrincipal: "",
    instrumentosSecundarios: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { instrumentosSecundarios, ...dados } = formData;
    const formattedData = {
      ...dados,
      instrumentosSecundarios: instrumentosSecundarios.split(",").map((i) => i.trim()),
    };

    await createMusico(formattedData);
    alert("Músico cadastrado com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastrar Músico</h2>
      <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
      <input type="text" name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleChange} required />
      <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required />
      <input type="text" name="instrumentoPrincipal" placeholder="Instrumento Principal" value={formData.instrumentoPrincipal} onChange={handleChange} required />
      <input type="text" name="instrumentosSecundarios" placeholder="Instrumentos Secundários (separados por vírgula)" value={formData.instrumentosSecundarios} onChange={handleChange} />
      <button type="submit">Salvar</button>
    </form>
  );
};
export default MusicoForm;