const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

function authenticateUuid(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response
      .status(400)
      .json({ error: "This id is not valid." })
  }

  next();
}

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response
    .status(200)
    .json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs: techs,
    likes: 0
  }

  if (!title || !url || !techs) {
    return response
      .status(400)
      .json({ error: "This informations is not valid." })
  }

  repositories.push(repository);

  return response
    .status(200)
    .json(repository);

});

app.put("/repositories/:id", authenticateUuid, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryByIndex = repositories.findIndex(repository => repository.id === id)

  repositories[repositoryByIndex].title = title;
  repositories[repositoryByIndex].url = url;
  repositories[repositoryByIndex].techs = techs;

  return response
    .status(200)
    .json(repositories[repositoryByIndex])

});

app.delete("/repositories/:id", authenticateUuid, (request, response) => {
  const { id } = request.params;

  const repositoryByIndex = repositories.findIndex(repository => repository.id === id)

  repositories.splice(repositoryByIndex, 1)

  return response
    .status(204)
    .json({ message: "Repository was succesfully deleted." })
});

app.post("/repositories/:id/like", authenticateUuid, (request, response) => {
  const { id } = request.params;

  const repositoryByIndex = repositories.findIndex(repository => repository.id === id)

  repositories[repositoryByIndex].likes = repositories[repositoryByIndex].likes + 1;

  return response
    .status(200)
    .json(repositories[repositoryByIndex])

});

module.exports = app;
