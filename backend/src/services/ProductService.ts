import { ProductRepository } from '../repositories/ProductRepository';
import { Product } from '../entities/product';

export class ProductService {
  private productRepository: ProductRepository;

  
  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

 
  async createProduct(data: Partial<Product>): Promise<Product> {
    if(!data.name){throw new Error('voce não inseriu um nome ao produto')}

    if(!data.price || data.price <= 0){throw new Error('preço invalido')}
    return this.productRepository.createProduct(data); 
  }


  async getProductById(id: number): Promise<Product | null> {

    if(!id){
        throw new Error('usuário não inseriu o ID')
    }
    return this.productRepository.getProductById(id); 
  }

  
  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.getAllProducts();
  }

 
  async updateProduct(id: number, data: Partial<Product>): Promise<Product | null> {
    return this.productRepository.updateProduct(id, data); 
  }


  async deleteProduct(id: number): Promise<boolean> {
    return this.productRepository.deleteProduct(id); 
  }
}
