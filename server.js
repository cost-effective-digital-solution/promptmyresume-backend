const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { generateResume } = require('./generateAI');

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("PromptMyResume backend is running.");
});

app.use(cors());
app.use(bodyParser.json());

app.post('/api/generate', async (req, res) => {
  const formData = req.body;

  // Send email with user data
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NOTIFY_EMAIL,
      pass: process.env.NOTIFY_PASS,
    },
  });

  const mailOptions = {
    from: process.env.NOTIFY_EMAIL,
    to: process.env.RECEIVE_EMAIL,
    subject: 'New Resume Generation Request',
    text: `New user request:\nName: ${formData.fullName}\nEmail: ${formData.email}\nJob Title: ${formData.jobTitle}`
  };

  try {
    await transporter.sendMail(mailOptions);
    const result = await generateResume(formData);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate document or send email.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
