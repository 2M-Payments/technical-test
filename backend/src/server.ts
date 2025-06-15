import dotenv from 'dotenv';
dotenv.config();
import AppDataSource from "./database/app-datasource";
import express from 'express'
import { ProductController } from './controllers/ProductController';
import { ProductService } from './services/ProductService';
import { ProductRepository } from './repositories/ProductRepository';
import { validateProductCreate } from './middlewares/errorHandler';
import { validateProductUpdate } from './middlewares/errorHandler';
const app = express();

AppDataSource.initialize() 
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((error) => console.log(error))

const productRepository = new ProductRepository(AppDataSource);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);


const PORT = process.env.PORT || 3000;

app.post('/products', validateProductCreate,(req, res) => productController.createProduct(req, res)); 
app.get('/products', (req, res) => productController.getAllProducts(req, res)); 
app.get('/products/:id', (req, res) => productController.getProductById(req, res)); 
app.put('/products/:id', validateProductUpdate, (req, res) => productController.updateProduct(req, res)); 
app.delete('/products/:id', (req, res) => productController.deleteProduct(req, res)); 


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

