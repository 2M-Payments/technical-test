import React from "react";

const useNavigate = jest.fn();
const useLocation = jest.fn(() => ({}));
const useParams = jest.fn(() => ({}));

// Criamos um componente Routes que aceita children corretamente tipado
export const Routes: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  React.createElement("div", null, children);

export const Route: React.FC<{ path: string; element: React.ReactNode }> = ({
  element,
}) => React.createElement("div", null, element);

export const BrowserRouter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => React.createElement("div", null, children);

export { useNavigate, useLocation, useParams };