var express = require('express');
var router = express.Router();
var service=require('../service/serve')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/home', function(req, res, next) {
  res.render('homepage', { title: 'Express' });
});
router.post('/client',async (req,res)=>{
  var email=req.body.email;
  var username=req.body.username;
  var password=req.body.password;
  console.log(email,username,password)
  result=await service.RegisterClient(email,username,password)
  if(result.success){
    res.status(201).json("SUCCESFULLY CREATED USER")
  }else{
    res.status(500).json(result.error)
  }
 
})

module.exports = router;
