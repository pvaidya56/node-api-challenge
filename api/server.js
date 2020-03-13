const express = require("express");

const projectsRouter = require('../routers/projects-router.js');
const Actions = require('../data/helpers/actionModel');

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).json({
        message: process.env.SECRET_MESSAGE || "Welcome",
  });
})
  
  server.use("/api", projectsRouter);

  
  module.exports = server;