import { Repository } from "typeorm";
import { DataSource } from "typeorm";
import { User } from "../entities/user";

export class UserRepository {

    private repository: Repository<User>

    constructor(datasource: DataSource) {
        this.repository = datasource.getRepository(User)
    }


    async createUser(data: { userName: string; email: string; password: string }): Promise<User> {
        const user = this.repository.create(data);
        return await this.repository.save(user);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.repository.findOneBy({ email });
    }

    async updateUser(data:{id: number; email: string; userName: string, password: string}): Promise<any>{
        const user = await this.repository.update({id: data.id}, data);
        return user 
        
    }



}

