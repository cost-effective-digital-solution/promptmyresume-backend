const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const nodemailer = require('nodemailer');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("PromptMyResume backend is running.");
});

app.post("/api/generate", async (req, res) => {
  const data = req.body;

  // Setup mailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NOTIFY_EMAIL,
      pass: process.env.NOTIFY_PASS,
    },
  });

  const mailOptions = {
    from: process.env.NOTIFY_EMAIL,
    to: process.env.RECEIVE_EMAIL,
    subject: "New Resume Request",
    text: `Name: ${data.fullName}\nEmail: ${data.email}\nJob Title: ${data.jobTitle}`
  };

  try {
    // Send notification email
    await transporter.sendMail(mailOptions);

    // Compose DeepSeek prompt
    const prompt = `Create a professional, ATS-friendly resume and cover letter:\n
    Name: ${data.fullName}\n
    Job Title: ${data.jobTitle}\n
    Experience Level: ${data.experienceLevel || 'Not provided'}\n
    Skills: ${data.skills}\n
    Achievements: ${data.achievements || 'None'}\n
    Tone: ${data.tone || 'Professional'}\n
    Company: ${data.companyName || 'Not specified'}\n
    Motivation: ${data.motivation || 'Not specified'}\n
    Strengths: ${data.strengths || 'General'}\n
    Ensure the output includes both a resume and a tailored cover letter.`;

    const response = await axios.post("https://api.deepseek.com/v1/completions", {
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const result = response?.data?.choices?.[0]?.message?.content;

    if (!result) {
      console.error("DeepSeek returned empty or malformed result:", response.data);
      return res.status(500).json({ error: "AI generation failed. Please try again." });
    }

    res.json({ result });

  } catch (error) {
    console.error("Error during processing:", error.message);
    if (error.response?.data) console.error("API response error:", error.response.data);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
