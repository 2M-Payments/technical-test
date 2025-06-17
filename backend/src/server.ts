import dotenv from 'dotenv';
dotenv.config();
import AppDataSource from "./database/app-datasource";
import express from 'express'
import { ProductController } from './controllers/ProductController';
import { ProductService } from './services/ProductService';
import { ProductRepository } from './repositories/ProductRepository';
import { authMiddleware, validateProductCreate, validateUserAuth, validateUserCreate } from './middlewares/errorHandler';
import { validateProductUpdate } from './middlewares/errorHandler';
import { UserController } from './controllers/UserController';
import { UserService } from './services/UserService';
import { UserRepository } from './repositories/UserRepository';
import cors from 'cors';



const app = express();

app.use(express.json());

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

AppDataSource.initialize() 
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((error) => console.log(error))

const productRepository = new ProductRepository(AppDataSource);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const userRepository = new UserRepository(AppDataSource);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const PORT = process.env.PORT || 3000;

app.post('/products',authMiddleware, validateProductCreate,(req, res) => productController.createProduct(req, res)); 
app.get('/products',authMiddleware, (req, res) => productController.getAllProducts(req, res)); 
app.get('/products/:id',authMiddleware, (req, res) => productController.getProductById(req, res)); 
app.patch('/products/:id',authMiddleware, validateProductUpdate, (req, res) => productController.updateProduct(req, res)); 
app.delete('/products/:id',authMiddleware, (req, res) => productController.deleteProduct(req, res)); 


app.post('/user',validateUserCreate, (req, res) => userController.createUser(req, res));
app.post('/userAuth',validateUserAuth, (req, res) => userController.login(req, res));
app.get('/profile', authMiddleware,(req, res) => userController.profile(req, res));




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

