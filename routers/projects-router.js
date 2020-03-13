const express = require("express");

const Projects = require("../data/helpers/projectModel");
const Actions = require("../data/helpers/actionModel");

const router = express.Router();

//get all existing projects
router.get('/projects', (req,res) => {
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
router.post('/projects', validateProject, async (req, res) => {
    Projects.insert(req.body)
      .then(project => {
        res.status(201).json(project);
      })
      .catch(err => {
        res.status(500).json({ error: "Error creating project" });
      });
  });

//GET project by id
router.get('/projects/:id', validateProjectId, (req, res) => {
  Projects.get(req.params.id)
    .then(project => {
      if(project) {
        res.status(200).json(project);
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Error retrieving project data" });
    });
});
//update a project
router.put('/projects/:id', validateProjectId, (req, res) => {
    Projects.update(req.params.id, req.body)
      .then(project => {
        res.status(201).json(project);
      })
      .catch(err => {
        res.status(500).json({ error: "Error updating project" })
      });
})

//delete a project
router.delete('/projects/:id', validateProjectId, (req, res) => {
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

//Actions 
//get actions by project id
router.get('/projects/:id/actions', validateProjectId, (req, res) => {
  Projects.getProjectActions(req.params.id)
    .then(actions => {
      console.log('Actions: ', req.project.actions);
      res.status(200).json(actions);
    })
    .catch(err => {
      res.status(500).json({ error: "Error retrieving actions data" });
    });
});

//get all actions
router.get('/actions', (req, res) => {
  Actions.get()
    .then(projects => {
      res.status(200).json(projects)
    })
    .catch(err => {
      res.status(500).json({ error: "Error retrieving actions data" });
    });
})

router.get('/actions/:id', validateActionId, (req, res) => {
  Actions.get(req.params.id)
    .then(project => {
      if(project) {
        res.status(200).json(project);
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Error retrieving actions data" });
    });
});

router.post('/projects/:id/actions', validateProjectId, validateAction, (req, res) => {
  req.body.project_id = req.params.id;
  Actions.insert(req.body)
   .then(action => {
     res.status(201).json(action);
   })
   .catch(err => {
     res.status(500).json({error: "Error creating action for this post"});
   });
});

router.delete('/actions/:id', validateActionId, (req, res) => {
  Actions.remove(req.params.id)
    .then(project => {
      res.status(200).json({ message: "Action successfully deleted" });
    })
    .catch(err => {
      res.status(500).json({ error: "Error deleting action" });
    })
});

router.put('/actions/:id', validateActionId, (req, res) => {
  Actions.update(req.params.id, req.body)
    .then(project => {
      res.status(201).json(project);
    })
    .catch(err => {
      res.status(500).json({ error: "Error updating user" })
    });
});

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

  function validateAction(req, res, next) {
    if(!req.body) {
      res.status(400).json({ message: "Missing project data." });
    }
    else if(!req.body.description || !req.body.notes) {
      res.status(400).json({ message: "Missing required name and description fields." });
    }
    next();
  }
  
  function validateActionId(req, res, next) {
    Actions.get(req.params.id)
      .then(project => {
        if(project) {
          req.project = project;
          next();
        } else {
          res.status(400).json({ message: "Invalid action ID" });
        }
      })
      .catch(err => {
        res.status(500).json({ message: "Error retrieving action data" });
      });
  }
  
  
module.exports = router;