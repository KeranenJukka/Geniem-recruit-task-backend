import * as express from 'express';
import User from './models/User';
import Todo from './models/Todo';
import { BadRequestError, NotFoundError } from './Errors';



export default (router: express.Router) => {

/* -------- CORS- ----------*/

  router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  

/* -------- ADD USER- ----------*/

router.post('/adduser', async function (req, res) {
    
  console.log(req.body)

  const insert = await User.query().insert(req.body)
  .catch(err => {

    

    if (err.errno === 19) {
      res.send('used')
    }

  })

  .then(() => {

    res.send('success')

  })

  
})


/* -------- SOMETHING ----------*/


router.post('/todos', async function (req, res) {
    
  console.log(req.body)

  const insert = await Todo.query().insert(req.body)
  .catch(err => console.log(err));
 
  res.send('POST request to the homepage')
})





  router.get('/users', async (req, res) => {
    const users = await User.query();
    res.send(users);
  });

  router.get('/todos', async (req, res) => {
    const todos = await Todo.query();
    res.send(todos);
  });

  router.get('/todos', async (req, res) => {
    const todos = await Todo.query();
    res.send(todos);
  });


  router.get('/todos/:id', async (req, res) => {
    const id = req.query.id;
    if (!id || Number.isInteger(id)) throw new BadRequestError('Invalid TodoID!');

    const todo = await Todo.query().where({ id }).first();
    if (!todo) throw new NotFoundError('No such Todo!');
    return todo;
  });







};


