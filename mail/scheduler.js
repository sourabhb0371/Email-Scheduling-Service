const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
 
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
 
// Emails
const emails = [
  'kushagragoel1827@gmail.com',
  'dakhanemugdha@gmail.com',
  'sourabhb0371@gmail.com',
  'dst8074@gmail.com'
];
 
// Email Sending Function
const sendEmail = async (recipients, mail_subject, mail_body) => {
  try {
    const mailOptions = {
      from: '"Luffy" <mugiwar.d.luffy05@gmail.com>',
      to: recipients.join(','), // Convert array to comma-separated string
      subject: mail_subject,
      text: mail_body,
      // html: `<p>${mail_body}</p>` // Uncomment if you want HTML
    };
 
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
 
// Schedule Email Function
const scheduleEmail = (recipients, subject, body, sendTime) => {
  if (!(sendTime instanceof Date) || isNaN(sendTime)) {
    console.error('Invalid date provided for scheduling email.');
    return;
  }
 
  console.log('Scheduling email...');
  schedule.scheduleJob(sendTime, async () => {
    console.log(`Sending email to ${recipients.join(', ')} at ${sendTime}`);
    await sendEmail(recipients, subject, body);
  });
};
 
// Example Usage
const subject = 'Scheduled Email Trial';
const body = 'Hello, this email was sent at the scheduled time!';
const sendTime = new Date(2024, 10, 29, 17, 0, 0); // Year, Month (0-indexed), Day, Hour, Minute, Second
 
scheduleEmail(emails, subject, body, sendTime);
console.log('Email has been scheduled.');
 