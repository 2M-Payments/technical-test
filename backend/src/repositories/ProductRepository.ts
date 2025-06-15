import { Repository } from 'typeorm';
import { Product } from '../entities/product';
import { DataSource } from 'typeorm';

export class ProductRepository {
    private repository: Repository<Product>;


    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(Product);
    }

    async createProduct(data: Partial<Product>): Promise<Product> {
        const product = this.repository.create(data);
        return await this.repository.save(product);
    }

    async getProductById(id: number): Promise<Product | null> {
        return await this.repository.findOneBy({ id });
    }

    async getAllProducts(): Promise<Product[]> {
        return await this.repository.find();
    }

    async updateProduct(id: number, data: Partial<Product>): Promise<Product | null> {
        let product = await this.getProductById(id);
        if (!product) return null;
        product = this.repository.merge(product, data);
        return await this.repository.save(product);
    }

    async deleteProduct(id: number): Promise<boolean> {
        const product = await this.getProductById(id);
        if (!product) return false;
        await this.repository.remove(product);
        return true;
    }
}
