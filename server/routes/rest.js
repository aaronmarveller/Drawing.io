const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const nodeRestClient = require('node-rest-client').Client;
const restClient = new nodeRestClient();

const EXECUTE_SERVER_URL = 'http://localhost:8000/build_and_run';
restClient.registerMethod('build_and_run', EXECUTE_SERVER_URL, 'POST');

const problemService = require('../service/problemService');

// get all problems
router.get('/problems', (req, res) => {
    problemService.getProblems().then( problems => {
        res.json(problems);
    });
});

// get single problem
router.get('/problems/:id', (req, res) => {
    const id = req.params.id;
    problemService.getProblem(+id).then(problem => {
        res.json(problem);
    })
});

//add a problem
router.post('/problems', jsonParser, (req, res) => {
    // result of jsonParser is passed to req, so req.body contains the json file
    problemService.addProblem(req.body).then(problem => {
        res.json(problem);
    }, error => {
        res.status(400).send('problem name already exist!');
    })
});

router.post('/build_and_run', jsonParser, (req, res) => {
   const code = req.body.code;
   const lang = req.body.lang;

   console.log('lang: ' + lang + ', code: ' + code);

   restClient.methods.build_and_run({
       data: {code: code, lang: lang},
       headers: {'Content-Type': 'application/json'}
   }, (data, resp) => {
       const text = `${data['run']}`;
       res.json(text);
   });

});

module.exports = router ;