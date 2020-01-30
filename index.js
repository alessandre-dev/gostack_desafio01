const express = require('express');

const server = express();

server.use(express.json());

const projects = []; 

// Contar requisições
server.use((req, rest, next) => {
  console.count('Qtd. Requisições');  
  next(); 
})

// Valida campo Title
function checkTitleExists(req, res, next){
  if (!req.body.title){
    return res.status(400).json({error: 'Title is required'});
  }
  return next();
}

// Valida campo Id do Projeto
function checkIDProject(req, res, next){
  const index = projects.findIndex(item => item.id === req.params.id);  
  const project = projects[index];
  
  if (!project){
    return res.status(400).json({error: 'Project does not exists'});
  }
  
  req.indexProject = index;
  req.project = project;
  
  return next();
}
  
// POST - Criar projeto
server.post('/projects', checkTitleExists, (req, res) => {
  projects.push(req.body);
  return res.json(projects);
});

// GET - Listar projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// PUT - Alterar título do projeto
server.put('/projects/:id', checkTitleExists, checkIDProject, (req, res) => {
  req.project.title = req.body.title;
  return res.json(projects);  
});

// DELETE - Deletar projeto
server.delete('/projects/:id', checkIDProject, (req, res) => {
  projects.splice(req.indexProject, 1);
  return res.send();
});

// POST - Incluir tarefas ao projeto
server.post('/projects/:id/tasks', checkTitleExists, checkIDProject, (req, res) => {
  req.project.tasks.push(req.body.title);
  return res.json(projects);  
});

server.listen(3000);