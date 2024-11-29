// app.js
const express = require('express');
const path = require('path');
const logger = require('morgan');
const { sendEmail } = require('./mail/smtp');  // Import the SMTP module

const app = express();

// Set up view engine (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));   // Log requests
app.use(express.json());  // Parse JSON bodies
app.use(express.urlencoded({ extended: false }));  // Parse URL-encoded bodies

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
app.get('/', (req, res) => {
  res.render('index', { title: 'Express SMTP Example' });
});

// Email sending route
app.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    const emailInfo = await sendEmail(to, subject, text, html);
    res.status(200).json({ message: 'Email sent successfully', info: emailInfo });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

// Error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler for development (show stack trace)
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', { message: err.message, error: err });
  });
}

// Error handler for production (no stack trace)
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: {} });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
