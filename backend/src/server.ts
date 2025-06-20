import app from './app';
import { AppDataSource } from './ormconfig'; 
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3333;

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });
