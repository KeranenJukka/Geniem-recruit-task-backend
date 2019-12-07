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
  

/* -------- Get user and id from token - ----------*/

  const getIdandUser = async (arg: string) => {
  
    return new Promise((resolve, reject) => {
      
      var token = validateToken(arg);
      token = JSON.parse(token["sub"])
    
      return resolve(token);

    })
    .catch(( ) => {
      console.log("error")
    })

  
  }  



/* -------- Login ----------*/

router.post('/login', async function (req, res) {
    
var pass = req.body.password;

await User.query().where("username", req.body.username)
.then(resp => {

    if (resp.length === 0) {
      res.send("no")
      return null
    }
    
    var pass = req.body.password;
    var hash = resp[0]["password"];
    
  
    comparePassword(pass, hash)
    .then(response => {
      
      if (response === false) {
        res.send(response)
      }

      else if (response === true) {

        var info = {
          username: resp[0]["username"],
          id: resp[0]["id"]
        };

        var token = JSON.stringify(info)
        
        token = issueToken(token);
        
        res.send({
          res: "success",
          token: token,
          user: resp[0]["firstname"] + " " + resp[0]["lastname"]
        })

      }

    })
    


    
})
.catch(err => {console.log(err)})

  
})



/* -------- Check username ----------*/

router.post('/checkuser', async function (req, res) {
    
  

  await User.query().where("username", req.body.username)
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

//add function  
var add = async (theinfo: object) => {

  await User.query().insert(theinfo)
  .catch(() => {
    
  })

  .then(async () => {

    //check id
    await User.query().where("username", info.username)
    .then((response) => {
  
    var id = response[0].id;
      
    // get token

    var info = {
      username: req.body.username,
      id: id
    };

    var token = JSON.stringify(info)
    
    token = issueToken(token);
    
    res.send({
      res: "success",
      token: token,
      user: req.body.firstname + " " + req.body.lastname
    })
      
  
    })
 
  })

}


/* HASH */

hashPassword(req.body.password)
  .then(async (res)  =>  {
    
    info.password = res.hash;

    // use function
    add(info)
    
  })

  
})



/* -------- Get user posts ----------*/

router.post('/getposts', async (req, res) => {

  getIdandUser(req.body.token)
  .then(async (info) => {

    await Todo.query().where("userId", info["id"])
    .then((response) => {
  
      res.send(response)
  
    })
    .catch(() => {

    })

  })
  .catch(() => {
    res.send("error")
  })

  
});

/* -------- Add post ----------*/


router.post('/addpost', async (req, res) => {

  getIdandUser(req.body.token)
  .then(async (info) => {

    var post = {
      title: "post",
      description: req.body.description,
      userId: info["id"],
      checkbox: "no"
     }

     
      await Todo.query().insert(post)
      .then(()=>{
        res.send("success")
      })
      .catch(() => {
        
      })


    })
    .catch(() => {
      res.send("error")
    })

  })


/* -------- Delete post ----------*/


router.post('/deletepost', async (req, res) => {

  getIdandUser(req.body.token)
  .then(async (info) => {

    var post = req.body.id;

    await Todo.query()
    .where("id", post)
    .where("userId", info["id"])
    .delete()
    .then(() => {
      res.send("success")
    })
    .catch(() => {
      res.send("error")
    })

  })
  .catch(() => {
    res.send("error")
  })

 
  });


  /* -------- Change post ----------*/


router.post('/changepost', async (req, res) => {


  getIdandUser(req.body.token)
  .then(async (info) => {

    var post = req.body.id;

    await Todo.query()
    .where("id", post)
    .where("userId", info["id"])
    .patch({description: req.body.text})
    .then((response) => {
      console.log(response)
      res.send("success")
    })
    .catch((err) => {
      console.log(err)
      res.send("error")
    })


   })
  .catch((err) => {
    console.log(err)
    res.send("error")
  })


 
  });


/* -------- SOMETHING ----------*/


router.post('/todos', async function (req, res) {
    
  console.log(req.body)

  await Todo.query().insert(req.body)
  .catch((err) => {});
 
  res.send('POST request to the homepage')
})


  router.get('/users', async (req, res) => {
    const users = await User.query();
    res.send(users);
  });


};

hashPassword("moimoi")

.then((pass) => {

var password = pass.hash



setTimeout(() => {
    
  var n1 = {

    username: "kerde",
    firstname: "jukka",
    lastname: "keränen",
    password: password
  
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
    password: "jotain"
  
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
    checkbox: "no"
      
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
  checkbox: "no"
    
}

async function jes4 () {
  console.log("lisätään tekstiä!")
  const ins = await Todo.query().insert(n4)
  .catch((err) => {
    console.log(err)
  })

}

jes4()


var n5 = {

  title: "postifasda",
  description: "tekssdffdftiä",
  userId: 1,
  checkbox: "no"
    
}

async function jes5 () {
  console.log("lisätään tekstiä!")
  const ins = await Todo.query().insert(n5)
  .catch((err) => {
    console.log(err)
  })

}

jes5()


}, 5000);

})


/*

router.get('/todos/:id', async (req, res) => {
  console.log(req.query)
  const id = req.query.id;
  if (!id || Number.isInteger(id)) throw new BadRequestError('Invalid TodoID!');

  const todo = await Todo.query().where({ id }).first();
  if (!todo) throw new NotFoundError('No such Todo!');
  return todo;
});

*/