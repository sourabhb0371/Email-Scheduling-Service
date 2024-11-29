const nodemailer = require('nodemailer');
 
// SMTP Configuration
const smtpConfig = {
  host: 'smtp.gmail.com',  // Gmail SMTP server
  port: 587,              // TLS port
  secure: false,          // Use true for SSL (port 465)
  auth: {
    user: 'mugiwar.d.luffy05@gmail.com',  // Your Gmail address
    pass: 'lngz jhxn pzde ctfm'           // Your App Password (not your Gmail password)
  }
};
 
// Create a transporter
const transporter = nodemailer.createTransport(smtpConfig);
//emails
const emails= ['kushagragoel1827@gmail.com', 'dakhanemugdha@gmail.com', 'sourabhb0371@gmail.com', 'dst8074@gmail.com']
 
// Email details
const sendEmail = async (to, subject, body) => {
  try {
    const mailOptions = {
      from: '"Luffy" <mugiwar.d.luffy05@gmail.com>', // Sender's name and email
      to: emails,                                       // Recipient email
      subject: 'Trail email',                             // Email subject
      text: 'Hello Xmen, This is Test 5',             // Plain text email body
      //html: `<p>${body}</p>`                        // HTML email body (optional)
    };
 
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
 
//Example usage
const recipient = emails; // Replace with the recipient's email
const subject = 'Test Email from Node.js SMTP Client';
const body = 'Hello, this is a test email sent using Node.js and Gmail SMTP.';
sendEmail(recipient, subject, body);

module.exports = {sendEmail};