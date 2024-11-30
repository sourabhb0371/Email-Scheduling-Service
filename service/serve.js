const con=require('../DBconfig/db')
const email=require('../mail/email')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const schedule = require('node-schedule');
const { use } = require('../routes');

// Function to hash a password
async function hashPassword(plainPassword) {
  const saltRounds = 10;  // Number of salt rounds (higher is more secure but slower)
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

// Function to verify a password
async function verifyPassword(plainPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;  // Returns true if passwords match, false otherwise
}

// Function to generate a new UUID
function generateNewUuid() {
  const newUuid = uuidv4();
  console.log('Generated UUID:', newUuid);
  return newUuid;
}


async function  RegisterClient(email, username, password){
    var id=generateNewUuid();
    var hashedPassword=await hashPassword(password);
    result=con.executeQuery('INSERT INTO clients (id, email, username, password) VALUES (? , ? , ? , ?)',[id,email,username,hashedPassword]);
    return result
}

async function LoginClient(email,password){
  var result=await con.executeQuery('Select id, email, password from clients where email= ?',[email])
  if (! result.success){
    console.log(result)
    return result
  }
  var clientData=result.data[0]
  console.log(clientData)
  if (await verifyPassword(password,clientData.password)){
    return {success:true, data:clientData.id}
  }else{
    return {success:false,error:"invalid credentials"}
  }
}

async function RegisterTemplate(templateName,templateSub,templateBody,clientId){
  var templateId=generateNewUuid()
  const result=await con.executeQuery('INSERT INTO template (id, clientId,templateName,templateSubject,templateBody) VALUES (?, ?, ?, ?, ?)',[templateId,clientId,templateName,templateSub,templateBody])
  console.log(result.error)
  return result
}
async function GetTemplates(clientId){
  const result=await con.executeQuery('Select * from template where clientId= ?',[clientId])
  console.log(result.error)
  return result
}
async function SendMail(isSchduled,templateId,userEmailsList,scheduledAt){
  result=await con.executeQuery('select templateSubject,templateBody from template where id= ?',[templateId])
  if(!result.success){
    return result
  }
  const maildetails={subject:result.data[0].templateSubject,body:result.data[0].templateBody}
  if(isSchduled =='false' ){
    return await sendmail(userEmailsList,maildetails)
  }else{
    return sendScheduledmail(userEmailsList,maildetails,scheduledAt)
  }
}

async function sendmail(userEmailsList,maildetails){
  for(const user of userEmailsList){
    console.log(user)
    await email.sendEmail(user,maildetails.subject,maildetails.body)
  }
  return {success:true}
}

function sendScheduledmail(userEmailsList,maildetails,scheduledAt){
  console.log(2,userEmailsList,maildetails,scheduledAt)
  if(scheduledAt.length !=5){
    return({success:false, Message:"invalid scheduling"})
  }
  var minute=scheduledAt[0]
    var hour=scheduledAt[1]
    var day=scheduledAt[2]
    var month=scheduledAt[3]
    var weekday=scheduledAt[4]
    schedule.scheduleJob(`${minute} ${hour} ${day} ${month} ${weekday}`,()=>{
      sendmail(userEmailsList,maildetails)
    })
  return {success:true}
}

module.exports={RegisterClient,LoginClient,RegisterTemplate,GetTemplates,SendMail}