import * as express from 'express';
import User from './models/User';
import Todo from './models/Todo';
import { BadRequestError, NotFoundError } from './Errors';

import {issueToken, validateToken} from './accounts/jwt';
import {hashPassword, comparePassword} from './accounts/password';



export default (router: express.Router) => {



/* -------- CORS- ----------*/

  router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  router.use(express.json())
 

/* -------- Check username ----------*/

router.post('/checkuser', async function (req, res) {
    
  

  const check = await User.query().where("username", req.body.username)
  .then((response) => {

    if (response.length === 0) {
      res.send("notfound")
    }

    else {res.send("found")}

  })

  
})


/* -------- ADD USER- ----------*/

router.post('/adduser', async (req, res) => {
     
  var info = {...req.body}

  

var add = async (theinfo: object) => {

  const insert = await User.query().insert(theinfo)
  .catch(() => {
    
  })

  .then(() => {

    var token = issueToken(req.body.username);
    

    res.send({
      res: "success",
      token: token
    })
 
  })

}


/* HASH */

hashPassword(req.body.password)
  .then(async (res)  =>  {
    
    info.password = res.hash;

    add(info)
    
  })

  
})


/* -------- SOMETHING ----------*/


router.post('/todos', async function (req, res) {
    
  console.log(req.body)

  const insert = await Todo.query().insert(req.body)
  .catch((err) => {});
 
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


  router.get('/todos/:id', async (req, res) => {
    const id = req.query.id;
    if (!id || Number.isInteger(id)) throw new BadRequestError('Invalid TodoID!');

    const todo = await Todo.query().where({ id }).first();
    if (!todo) throw new NotFoundError('No such Todo!');
    return todo;
  });



};



setTimeout(() => {
    
  var n1 = {

    username: "kerde",
    firstname: "jukka",
    lastname: "keränen",
    password: "moimoi"
  
  }
  
  async function jes () {
    console.log("lisätään!")
    const ins = await User.query().insert(n1)
    .catch((err) => {
      console.log(err)
    })
  
  }
  
  jes()

  var n2 = {

    username: "kerdeman",
    firstname: "meikä",
    lastname: "keränen",
    password: "moimoifd"
  
  }
  
  async function jes2 () {
    console.log("lisätään!")
    const ins = await User.query().insert(n2)
    .catch((err) => {
      console.log(err)
    })
  
  }
  
  jes2()

}, 3000);



setTimeout(() => {
  
  var n3 = {

    title: "post",
    description: "tekstiä",
    userId: 1,
      
  }
  
  async function jes3 () {
    console.log("lisätään tekstiä!")
    const ins = await Todo.query().insert(n3)
    .catch((err) => {
      console.log(err)
    })
  
  }

jes3()

var n4 = {

  title: "postia",
  description: "tekssdfdftiä",
  userId: 2,
    
}

async function jes4 () {
  console.log("lisätään tekstiä!")
  const ins = await Todo.query().insert(n4)
  .catch((err) => {
    console.log(err)
  })

}

jes4()


}, 5000);

