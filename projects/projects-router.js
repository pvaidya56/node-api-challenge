const express = require("express");

const Projects = require("../data/helpers/projectModel");
const Actions = require("../data/helpers/actionModel");

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
router.post('/', validateProject, async (req, res) => {
    try{
        const project = await Projects.insert(req.body)
        res.status(201).json(response)
    }
    catch(err) {
        res.status(500).json({error: "Error creating project"})
    }
});

//GET project by id
    router.get('/:id', async (req,res) => {
       try {
           const project = await Projects.get(req.params.id);
           if(project) {
               res.status(200).json(project)
           } else {
               res.status(400).json({message: "Project with specified ID does not exist"})
           }
       }
       catch (err) {
           res.status(500).json({error: "Project not found"})
       }
    })
//update a project
router.put('/:id', async (req, res) => {
    try {
        const updatedProject = await Projects.update(req.params.id, req.body)

        if (updatedProject) {
            res.status(201).json(updatedProject)
        }
        else {
            res.status(404).json({message: "Project not found"})
        }
    }
    catch (err) {
        res.status(500).json({error: "Project not be updated"})
    }
})

//delete a project
router.delete('/:id', (req, res) => {
    Projects.remove(req.params.id)
        .then(response => {
            console.log(response)
            if (response) {
                res.status(200).json({message: "Project deleted successfully"})
            }
            else {
                res.status(404).json({message: `Project not found`}) 
            }
        })
        .catch(response => {
            res.status(500).json({error: "Project could not be deleted"})
        })
})




//custom middleware

//ensures that project exists
function validateProject(req, res, next) {
    if (!req.body) {
      res.status(400).json({message: "missing user data"})
    }
    else if (!req.body.name) {
      res.status(400).json({message: "missing required name field"})
    }
    else {
      next();
    }
  }

  //ensures that action exists
  function validateAction(req, res, next) {
    if (!req.body) {
      res.status(400).json({message: "Missing action data"})
    }
    else if (!req.body.description) {
      res.status(400).json({message: "Missing required description field"})
    }
    else {
      next();
    }
  }

module.exports = router;