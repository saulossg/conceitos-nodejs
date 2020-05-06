const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {

  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).send('Is not is a Identifier valid!')
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id : uuid(),
    title,
    url,
    techs,
    likes : 0
  }

  repositories.push(repository);

  return response.status(201).send(repository);

});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {

  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = repositories.find(repository => repository.id === id);

  repository.id = id;
  repository.title = title;
  repository.url = url;
  repository.techs = techs; 

  return response.status(200).json(repository);

});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {

  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id); 

  if(repositoryIndex < 0) {
    return repositories.status(400).send();
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id);

  repository.likes += 1; 

  return response.status(200).json(repository);

});

module.exports = app;
