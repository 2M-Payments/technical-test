import { render, screen } from "@testing-library/react";
import App from "../App";

test("Renderiza o título da página", () => {
  render(<App />);
  const titleElement = screen.getByText(/Lista de Músicos/i);
  expect(titleElement).toBeInTheDocument();
});