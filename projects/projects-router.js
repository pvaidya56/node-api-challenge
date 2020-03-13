const express = require("express");

const Projects = require("../data/helpers/projectModel");

const router = express.Router();

//get all existing projects
router.get('/', (req,res) => {
    Projects.get()
        .then(response => {
            res.status(200).json(response)
        })
        .catch(error => {
            res.status(500).json({
                error: "The project could not be retrieved."
            })
        })
});

//create a project
router.post('/', (req, res) => {
    Projects.insert(req.body)
    .then(response => {
        res.status(201).json(response)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({error: "Error creating project"})
    })
});


//custom middleware
//ensures that a project with specified id exists 
function validateProjectId(req, res, next) {
    Projects.getById(req.params.id)
    .then(project => {
        if (project.id){
            req.project = project;
        } next();
    })
    .catch(error => {
        console.log(error)
        res.status(400).json({message: "Invalid Project"})
      })
}

module.exports = router;