const express = require("express");
const Users = require("./userDb.js");
const Posts = require("../posts/postDb.js");

const router = express.Router();

const errorHandler = (err, req, res, next) => {
  if(err) {
    res.status(500).json({message: "There was an error handling the request"});
  }
}

const validateUserId = async (req, res, next) => {
  try{
    const user = await Users.getById(req.params.id);
    if (user){
      req.user = user;
      //console.log(user);
      next();
    }else{
      res.status(400).json({message: "invalid user id"});
    }
  } catch {
    const err = new Error("Something went wrong when checking for user id");
    next(err);
  }
}

const validateUser = (req, res, next) => {
  if (!Object.keys(req.body).length){
    if (!req.body.name){
    res.status(400).json({message: "missing required name field"});
  }else{
    console.log(req.body);
    next();
  }
  }else{
    res.status(400).json({message: "missing user data"});
  }
}

const validatePost = (req, res, next) => {
  if (Object.keys(req.body).length){
    if(!req.body.text){
      res.status(400).json({message: "missing required text field"});
    }else{
      next();
    }
  }else{
    res.status(400).json({message: "missing post data"});
  }
}

router.post("/", validateUser, async (req, res, next) => {
  try{
    const newUser = await Users.insert(req.body);
    res.status(201).json(newUser);
  }catch{
    const err = new Error("Error during user creation");
    next(err);
  }
});

router.post("/:id/posts", [validateUserId, validatePost], async (req, res, next) => {
  try{
    req.body.user_id = req.params.id;
    const post = await Posts.insert(req.body);
    res.status(201).json(post);
          } catch {
            const err = new Error("Error during post creation");
    next(err);
  }
});

router.get("/", (req, res) => {
  
});

router.get("/:id", validateUserId, (req, res) => {
  res.json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {});

router.delete("/:id", validateUserId, (req, res) => {});

router.put("/:id", validateUserId, (req, res) => {});

//custom middleware


router.use(express.json());
router.use(validateUserId);
router.use(validateUser);
router.use(validatePost);
router.use(errorHandler);

module.exports = router;
