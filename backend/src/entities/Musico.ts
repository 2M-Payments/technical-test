import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Musico {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255 })
    nome!: string;

    @Column({ type: "varchar", length: 20 })
    telefone!: string;

    @Column({ type: "date" })
    dataNascimento!: Date;

    @Column({ type: "varchar", length: 255 })
    instrumentoPrincipal!: string;

    @Column({ type: "text", array: true, nullable: true })
    instrumentosSecundarios?: string[];
}
