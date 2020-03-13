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
    Project.insert(req.body)
      .then(project => {
        res.status(201).json(project);
      })
      .catch(err => {
        res.status(500).json({ error: "Error creating project" });
      });
  });

//GET project by id
    router.get('/:id', validateProjectId, async (req,res) => {
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
router.put('/:id', validateProjectId, async (req, res) => {
    Projects.update(req.params.id, req.body)
      .then(project => {
        res.status(201).json(project);
      })
      .catch(err => {
        res.status(500).json({ error: "Error updating user" })
      });
})

//delete a project
router.delete('/:id', validateProjectId, (req, res) => {
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
//ACTIONS: 

//get a projects actions (get action by project id)
router.get('/:id/actions', validateProjectId, (req, res) => {
    Projects.getProjectActions(req.params.id)
      .then(actions => {
        res.status(200).json(actions);
      })
      .catch(err => {
        res.status(500).json({ error: "Error retrieving posts data" });
      });
  });

//create an action by project id

//update an action by project id

//delete an action by project id




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

  // ensures that projectId exists
function validateProjectId(req, res, next) {
    Projects.get(req.params.id)
      .then(project => {
        if(project) {
          req.project = project;
          next();
        } else {
          res.status(400).json({ message: "Invalid project ID" });
        }
      })
      .catch(err => {
        res.status(500).json({ message: "Error retrieving project data" });
      });
  }
  
  //ensures that action exists
  function validateAction(req, res, next) {
    if(!req.body.description || !req.body.notes) {
      res.status(400).json({ message: "Missing required text field." });
    }
    next();
  }


module.exports = router;