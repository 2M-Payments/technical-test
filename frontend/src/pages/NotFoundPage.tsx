
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-9xl font-extrabold text-gray-800 tracking-widest">404</h1>
      <div className="bg-blue-500 px-2 text-sm rounded rotate-12 absolute">
        Página Não Encontrada
      </div>
      <p className="mt-4 text-lg text-gray-600">
        Oops! Parece que a página que você está procurando não existe.
      </p>
      <Link
        to="/login"
        className="mt-6 px-5 py-3 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring"
      >
        Voltar para a Página de Login
      </Link>
    </div>
  );
};

export default NotFoundPage;