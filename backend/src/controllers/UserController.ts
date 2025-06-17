import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {

    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.userService.createUser(req.body);
            res.status(201).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao criar um usuário', error });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.userService.authUser(req.body);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ message: 'erro na tentativa de se autenticar', error });
        }
    }


    async profile(req: Request, res: Response): Promise<void> {
        res.status(200).json({
            message: "Usuário autenticado",
            user: req.user,
        });
    }
}