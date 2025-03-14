import React, { useEffect, useState, useCallback } from "react";
import {
  getMusicos,
  getMusicoById,
  getMusicosByInstrumento,
  getMusicosByInstrumentoSecundario,
  deleteMusico,
  deleteMusicosEmLote,
  deleteTodosMusicos,
  updateMusico,
} from "../services/musicoService";

export const MusicoList = () => {
  const [musicos, setMusicos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const limite = 10;
  const [busca, setBusca] = useState("");
  const [buscaTipo, setBuscaTipo] = useState("id");
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [editando, setEditando] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    dataNascimento: "",
    instrumentoPrincipal: "",
    instrumentosSecundarios: "",
  });

  const carregarMusicos = useCallback(async () => {
    const data = await getMusicos(pagina, limite);
    setMusicos(data);
  }, [pagina]);

  useEffect(() => {
    carregarMusicos();
  }, [pagina, carregarMusicos]); 

  const handleBusca = async () => {
    let data = [];
    if (!busca) return carregarMusicos();

    switch (buscaTipo) {
      case "id":
        data = [await getMusicoById(busca)];
        break;
      case "instrumentoPrincipal":
        data = await getMusicosByInstrumento(busca);
        break;
      case "instrumentoSecundario":
        data = await getMusicosByInstrumentoSecundario(busca);
        break;
      default:
        return;
    }

    setMusicos(data);
  };

  const handleDelete = async (id: string) => {
    await deleteMusico(id);
    carregarMusicos();
  };

  const handleDeleteLote = async () => {
    if (selecionados.length === 0) return alert("Nenhum músico selecionado.");
    await deleteMusicosEmLote(selecionados);
    setSelecionados([]);
    carregarMusicos();
  };

  const handleDeleteTodos = async () => {
    if (!window.confirm("Tem certeza que deseja excluir todos os músicos?")) return;
    await deleteTodosMusicos();
    carregarMusicos();
  };

  const handleEditar = (musico: any) => {
    setEditando(musico.id);
    setFormData({
      nome: musico.nome,
      telefone: musico.telefone,
      dataNascimento: musico.dataNascimento,
      instrumentoPrincipal: musico.instrumentoPrincipal,
      instrumentosSecundarios: musico.instrumentosSecundarios.join(", "),
    });
  };

  const handleSalvarEdicao = async (id: string) => {
    const { instrumentosSecundarios, ...dados } = formData;
    const formattedData = {
      ...dados,
      instrumentosSecundarios: instrumentosSecundarios.split(",").map((i) => i.trim()),
    };

    await updateMusico(id, formattedData);
    setEditando(null);
    carregarMusicos();
  };

  return (
    <div>
      <h1>Lista de Músicos</h1>

      {/* Filtros de Busca */}
      <div>
        <select value={buscaTipo} onChange={(e) => setBuscaTipo(e.target.value)}>
          <option value="id">Buscar por ID</option>
          <option value="instrumentoPrincipal">Por Instrumento Principal</option>
          <option value="instrumentoSecundario">Por Instrumento Secundário</option>
        </select>
        <input type="text" placeholder="Digite sua busca" value={busca} onChange={(e) => setBusca(e.target.value)} />
        <button onClick={handleBusca}>Buscar</button>
        <button onClick={carregarMusicos}>Limpar Filtro</button>
      </div>

      {/* Lista de Músicos */}
      <ul>
        {musicos.map((musico: any) => (
          <li key={musico.id}>
            <input
              type="checkbox"
              checked={selecionados.includes(musico.id)}
              onChange={(e) => {
                setSelecionados((prev) =>
                  e.target.checked ? [...prev, musico.id] : prev.filter((id) => id !== musico.id)
                );
              }}
            />
            {editando === musico.id ? (
              <div>
                <input type="text" name="nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
                <input type="text" name="telefone" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} />
                <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })} />
                <input type="text" name="instrumentoPrincipal" value={formData.instrumentoPrincipal} onChange={(e) => setFormData({ ...formData, instrumentoPrincipal: e.target.value })} />
                <input type="text" name="instrumentosSecundarios" value={formData.instrumentosSecundarios} onChange={(e) => setFormData({ ...formData, instrumentosSecundarios: e.target.value })} />
                <button onClick={() => handleSalvarEdicao(musico.id)}>Salvar</button>
                <button onClick={() => setEditando(null)}>Cancelar</button>
              </div>
            ) : (
              <div>
                <strong>{musico.nome}</strong> - {musico.instrumentoPrincipal} <br />
                Telefone: {musico.telefone} | Aniversário {musico.dataNascimento} <br />
                Instrumentos Secundários: {musico.instrumentosSecundarios.join(", ")} <br />
                <button onClick={() => handleEditar(musico)}>Editar</button>
                <button onClick={() => handleDelete(musico.id)}>Excluir</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Paginação */}
      <div>
        <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>Anterior</button>
        <span>Página {pagina}</span>
        <button onClick={() => setPagina(pagina + 1)}>Próxima</button>
      </div>

      {/* Ações Globais */}
      <div>
        <button onClick={handleDeleteLote} disabled={selecionados.length === 0}>Excluir Selecionados</button>
        <button onClick={handleDeleteTodos}>Excluir Todos</button>
      </div>
    </div>
  );
};
