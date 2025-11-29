import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { ProductService } from "@/services/product.service";

export class ProductController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const productService = container.resolve(ProductService);
      const product = await productService.create(request.validated!.body, request.userId);
      return response.status(201).json(product);
    } catch (error) {
      return next(error);
    }
  }

  async list(request: Request, response: Response, next: NextFunction) {
    try {
      const productService = container.resolve(ProductService);
      const result = await productService.list(request.validated!.query, request.userId);
      return response.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async findOne(request: Request, response: Response, next: NextFunction) {
    try {
      const productService = container.resolve(ProductService);
      const product = await productService.findById(request.params.id, request.userId);
      return response.json(product);
    } catch (error) {
      return next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const productService = container.resolve(ProductService);
      const product = await productService.update(request.params.id, request.validated!.body, request.userId);
      return response.json(product);
    } catch (error) {
      return next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const productService = container.resolve(ProductService);
      await productService.delete(request.params.id, request.userId);
      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  }

  async deleteMany(request: Request, response: Response, next: NextFunction) {
    try {
      const productService = container.resolve(ProductService);
      const result = await productService.deleteMany(request.validated!.body, request.userId);
      return response.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async deleteAll(request: Request, response: Response, next: NextFunction) {
    try {
      const productService = container.resolve(ProductService);
      const result = await productService.deleteAll(request.userId);
      return response.json(result);
    } catch (error) {
      return next(error);
    }
  }
}

