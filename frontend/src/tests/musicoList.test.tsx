import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MusicoList from "../pages/MusicoList";
import * as service from "../services/musicoService";
import { BrowserRouter } from "react-router-dom";

jest.mock("../services/musicoService");

describe("Componente MusicoList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Deve exibir a lista de músicos", async () => {
    jest.spyOn(service, "getMusicos").mockResolvedValue([
      { id: "1", nome: "João", instrumentoPrincipal: "Guitarra", telefone: "1234", dataNascimento: "1990-01-01", instrumentosSecundarios: [] },
    ]);

    render(
      <BrowserRouter>
        <MusicoList />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText("João")).toBeInTheDocument());
  });
});
