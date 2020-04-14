const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//Rota que mostra todos os repositorios
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

//Rota que adiciona um novo repositorio
app.post("/repositories", (request, response) => {
  const {title, url, techs} =  request.body;

  //Criando o objeto com suas propriedades
   const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
   }

  //Push adiciona os elementos dentro da array repositories
   repositories.push(repository);

  //retornando o repositorio que acabou de ser adicionado
   return response.json(repository);
});

//Rota que permite alteração dos dados title, url, techs 
app.put("/repositories/:id", (request, response) => {
  const{ id } = request.params; 
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repositories => repositories.id == id)

  if (repositoryIndex < 0){
    return response.status(400).json( { error: 'Respository not found' })
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
  
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repositories => repositories.id == id)

  if (repositoryIndex < 0){
    return response.status(400).json( { error: 'Respository not found' })
  }

  repositories.splice(repositoryIndex,1);

  return response.status(204).send();


});

//rota para dar like no repositorio
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id == id)

  if (!repository){
    return response.status(400).json( { error: 'Respository not found' })
  }

  repository.likes += 1;

  return response.json(repository);

});

module.exports = app;
