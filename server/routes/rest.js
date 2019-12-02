const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const problemService = require("../services/problemService");

router.get('/problems', (req, res) => { //request, response
    problemService.getProblems()
        .then((problems) => {
            res.json(problems);
    });
});

router.get('/problems/:id', (req, res) => {
    const id = req.params.id;
    problemService.getProblem(+id)    //convert to string
        .then((problem) => {
            res.json(problem);
        });
});

router.post('/problems', jsonParser, (req, res) => {
    problemService.addProblem(req.body)
        .then(problem => {
            res.json(problem);
        }, error => {
            res.status(400).send('Problem name Already exists');
        });
});

module.exports = router;    //like the export class in client folder