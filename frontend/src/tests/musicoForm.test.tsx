import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MusicoForm from "../pages/MusicoForm";
import * as service from "../services/musicoService";
import { BrowserRouter } from "react-router-dom";

jest.mock("../services/musicoService");

describe("Componente MusicoForm", () => {
  it("Deve permitir cadastrar um músico", async () => {
    jest.spyOn(service, "createMusico").mockResolvedValue({
      id: "2",
      nome: "Novo Músico",
      instrumentoPrincipal: "Violão",
    });

    render(
      <BrowserRouter>
        <MusicoForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Nome"), { target: { value: "Novo Músico" } });
    fireEvent.change(screen.getByPlaceholderText("Instrumento Principal"), { target: { value: "Violão" } });

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => expect(service.createMusico).toHaveBeenCalled());
  });
});
