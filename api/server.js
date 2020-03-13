const express = require("express");

const projectsRouter = require('../routers/projects-router.js');
const Actions = require('../data/helpers/actionModel');

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    const query = req.query;
  
    console.log("query", query);
  
    res.status(200).json(query);
  });

  
  server.use("/api", projectsRouter);

  
  module.exports = server;