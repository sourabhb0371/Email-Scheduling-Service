var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');



// Secret key for JWT generation (you should keep this in a .env file for security)
const JWT_SECRET = 'kdguwhuxbaxbuje837e8d2eudb9qdhxb'; 

// Middleware to verify JWT from cookies
function verifyJWT(req, res, next) {
  const token = req.cookies.token;  // Retrieve the token from the cookies

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
    }

    req.user = decoded;  // Attach the decoded token to the request object
    next();
  });
}

function verifyJWTByAuth(req, res, next) {
  // Get the token from the Authorization header (format: Bearer <token>)
  const token = req.headers['authorization']?.split(' ')[1];  // Split "Bearer <token>"

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
    }

    req.user = decoded;  // Attach the decoded token to the request object
    next();
  });
}


var service=require('../service/serve')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register',function(req,res,next){
  res.render('register');
});
router.get('/home',verifyJWT,function(req,res,next){
  res.render('homepage');
});

router.post('/client',async (req,res)=>{
  var email=req.body.email;
  var username=req.body.username;
  var password=req.body.password;
  console.log(email,username,password)
  result=await service.RegisterClient(email,username,password)
  if(result.success){
    res.status(201).redirect('/')
  }else{
    res.status(500).redirect('/')
  }
});

 router.post('/login',async (req,res)=>{
  var email=req.body.email;
  var password=req.body.password;
  result=await service.LoginClient(email,password)
  if(result.success){
    const token = jwt.sign({ id: result.data}, JWT_SECRET, {
      expiresIn: '1d'  // Optional: Set expiration time for the token
    });
       // Set JWT in HttpOnly, Secure cookie
       res.cookie('token', token, {
        httpOnly: true,   // Prevent access to the cookie from JavaScript
        secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        maxAge: 3600000,  // Set cookie expiration time (1 hour)
        sameSite: 'Strict' // Helps to prevent CSRF attacks
      });
    res.status(201).redirect('/home');
  }else{
    res.status(401).json(result.error);
  }
 });

 // Logout route (clear the cookie)
router.post('/logout', (req, res) => {
  // Clear the JWT cookie
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'You have been logged out.',
  });
});

// Protected route (requires JWT from cookie)
router.get('/protected', verifyJWT, (req, res) => {
  res.json({
    success: true,
    message: 'This is a protected route.',
    user: req.user  // Access the decoded JWT data (e.g., clientId, email)
  });
});

router.post('/template',verifyJWT,async (req,res)=>{
  var templateName=req.body.templateName
  var templateSub=req.body.templateSub
  var templateBody=req.body.templateBody
  var clientId=req.user.id
  result=await service.RegisterTemplate(templateName,templateSub,templateBody,clientId)
  if(result.success){
    res.status(201).json({Success:true,Message:"Template succesfully clreated"})
  }else{
    res.status(500).json({Success:false,Message:"Issue in creating user"})
  }
})

router.get('/template',verifyJWT,async(req,res)=>{
  var clientId=req.user.id
  result=await service.GetTemplates(clientId)
  if (result.success){
    res.status(200)
  }else{
    res.status(500).json({Success:false,Message:"Issue in fetching data"})
  }
});
router.get('/token',verifyJWT,(req,res)=>{
  const token=req.cookies.token
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  res.send(token)

})

router.post('/sendmail',verifyJWTByAuth,async(req,res)=>{
  var isSchduled=req.query.scheduled
  console.log(isSchduled)
  const templateId=req.body.templateId
  const userEmailsList=req.body.userEmailsList
  const scheduledAt=req.body.scheduledAt
  var result=await service.SendMail(isSchduled,templateId,userEmailsList,scheduledAt)
  if(result.success){
    res.status(200).json({Success:true,Message:"Mail send successfully"})
  }else{
    res.status(500).json({Success:false,Message:"Issue while sending mail"})
  }
})

module.exports = router;
