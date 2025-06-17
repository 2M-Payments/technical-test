import { useProductContext } from '../contexts/ProductContext';

const ProductPage = () => {
  const { products } = useProductContext();

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Lista de Produtos</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="border-b py-2">{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductPage;