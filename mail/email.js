const nodemailer = require('nodemailer');

 
// SMTP Configuration
const smtpConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'mugiwar.d.luffy05@gmail.com',
    pass: 'lngz jhxn pzde ctfm'
  }
};
 
// Create a transporter
const transporter = nodemailer.createTransport(smtpConfig);
 

 
// Email Sending Function
const sendEmail = async (recipient, mail_subject, mail_body) => {
  try {
    const mailOptions = {
      from: '"Luffy" <mugiwar.d.luffy05@gmail.com>',
      to: recipient, // Convert array to comma-separated string
      subject: mail_subject,
      text: mail_body,
      // html: `<p>${mail_body}</p>` // Uncomment if you want HTML
    };
 
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    return {success:true,Message:"Email send successfully"}
  } catch (error) {
    console.error('Error sending email:', error);
    return {success:false,Message:"issue in mailing"}
  }
};
 
module.exports={sendEmail}
 
 