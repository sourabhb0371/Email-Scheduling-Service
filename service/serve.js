const con=require('../DBconfig/db')
const email=require('../mail/email')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

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

module.exports={RegisterClient}