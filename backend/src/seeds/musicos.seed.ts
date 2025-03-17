import { AppDataSource } from "../config/database";
import { Musico } from "../entities/Musico";

const seedMusicos = async () => {
  console.log("Iniciando seed de músicos...");

  await AppDataSource.initialize();
  const musicoRepository = AppDataSource.getRepository(Musico);

  const musicos = [
    { nome: "Aline Barros", telefone: "11987654321", dataNascimento: new Date("1976-10-07"), instrumentoPrincipal: "Voz", instrumentosSecundarios: ["Piano"] },
    { nome: "Fernandinho", telefone: "11912345678", dataNascimento: new Date("1973-03-24"), instrumentoPrincipal: "Voz", instrumentosSecundarios: ["Guitarra"] },
    { nome: "André Valadão", telefone: "31999998888", dataNascimento: new Date("1978-04-16"), instrumentoPrincipal: "Voz", instrumentosSecundarios: ["Teclado"] },
    { nome: "Davi Sacer", telefone: "21977775555", dataNascimento: new Date("1975-11-30"), instrumentoPrincipal: "Voz", instrumentosSecundarios: ["Violão"] },
    { nome: "Thalles Roberto", telefone: "11966662222", dataNascimento: new Date("1977-11-11"), instrumentoPrincipal: "Voz", instrumentosSecundarios: ["Baixo"] },
    { nome: "Michael W. Smith", telefone: "554199998888", dataNascimento: new Date("1957-10-07"), instrumentoPrincipal: "Piano", instrumentosSecundarios: ["Voz"] },
    { nome: "Chris Tomlin", telefone: "554199997777", dataNascimento: new Date("1972-05-04"), instrumentoPrincipal: "Voz", instrumentosSecundarios: ["Violão"] },
    { nome: "Julio C. Gomes", telefone: "554199996666", dataNascimento: new Date("1984-01-01"), instrumentoPrincipal: "Baixo", instrumentosSecundarios: ["Violão"] },
    { nome: "Lauren Daigle", telefone: "554199995555", dataNascimento: new Date("1991-09-09"), instrumentoPrincipal: "Guitarra", instrumentosSecundarios: ["Teclado"] },
    { nome: "Matt Redman", telefone: "554199994444", dataNascimento: new Date("1974-02-14"), instrumentoPrincipal: "Voz", instrumentosSecundarios: ["Guitarra"] },
    { nome: "Gilvan Junior", telefone: "554199993333", dataNascimento: new Date("1980-01-01"), instrumentoPrincipal: "Guitarra", instrumentosSecundarios: ["Violão"] },
    { nome: "Jeremy Camp", telefone: "554199992222", dataNascimento: new Date("1978-01-12"), instrumentoPrincipal: "Voz", instrumentosSecundarios: ["Guitarra"] },
  ];

  await musicoRepository.insert(musicos);

  console.log("Músicos inseridos com sucesso!");
  
  await AppDataSource.destroy();
};

seedMusicos().catch((err) => {
  console.error("Erro ao inserir músicos:", err);
});
