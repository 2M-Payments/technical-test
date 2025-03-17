import React, { useEffect, useState, useCallback } from "react";
import {
  getMusicos,
} from "../services/musicoService";

export const MusicoList = () => {
  const [musicos, setMusicos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const limite = 10;

  const carregarMusicos = useCallback(async () => {
    const data = await getMusicos(pagina, limite);
    setMusicos(data);
  }, [pagina]);

  useEffect(() => {
    import("react-dom/test-utils").then(({ act }) => {
      act(() => {
        carregarMusicos();
      });
    });
  }, [pagina, carregarMusicos]);

  return (
    <div>
      <h1>Lista de Músicos</h1>
      <ul>
        {musicos.map((musico: any) => (
          <li key={musico.id}>{musico.nome}</li>
        ))}
      </ul>
    </div>
  );
};

export default MusicoList;