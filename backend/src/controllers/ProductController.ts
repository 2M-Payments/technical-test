import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    async createProduct(req: Request, res: Response): Promise<void> {
        try {
            const product = await this.productService.createProduct(req.body);
            res.status(201).json(product);

        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar o produto', error });

        }
    }

    async getAllProducts(req: Request, res: Response): Promise<void> {
        try {
            const products = await this.productService.getAllProducts({page:req.query.page ? Number(req.query.page) : 1, limit: req.query.limit ? Number(req.query.limit) : 10 });
            res.status(200).json(products);

        } catch (error) {
            res.status(500).json({ message: 'Erro ao listar os produtos', error });

        }
    }

    async getProductById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const product = await this.productService.getProductById(Number(id));
            if (!product) {
                res.status(404).json({ message: 'Produto não encontrado' });

            }
            res.status(200).json(product);

        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar o produto', error });

        }
    }

    async updateProduct(req: Request, res: Response): Promise<void> {

        const { id } = req.params;
        const data = req.body;
        try {
            const updatedProduct = await this.productService.updateProduct(Number(id), data);
            if (!updatedProduct) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }
            res.status(200).json(updatedProduct);

        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar o produto', error });

        }
    }

    async deleteProduct(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const success = await this.productService.deleteProduct(Number(id));
            if (!success) {
                res.status(404).json({ message: 'Produto não encontrado' });

            }
            res.status(200).json({ message: 'Produto deletado com sucesso' });

        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar o produto', error });

        }
    }
}
