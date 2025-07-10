
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const axios = require('axios');
const PDFDocument = require('pdfkit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("PromptMyResume backend is running.");
});

app.post("/api/generate", async (req, res) => {
  const data = req.body;

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
    await transporter.sendMail(mailOptions);

    const prompt = `Create a professional, ATS-friendly resume and a cover letter:\n
    Name: ${data.fullName}
    Job Title: ${data.jobTitle}
    Experience Level: ${data.experienceLevel || 'Not provided'}
    Skills: ${data.skills}
    Achievements: ${data.achievements || 'None'}
    Tone: ${data.tone || 'Professional'}
    Target Company: ${data.companyName || 'Not specified'}
    Motivation: ${data.motivation || 'Not specified'}
    Strengths: ${data.strengths || 'General'}\n
    The output should be in clear sections for Resume and Cover Letter.`;

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
      return res.status(500).json({ error: "AI generation failed." });
    }

    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=PromptMyResume.pdf');
      res.send(pdfData);
    });

    doc.fontSize(12).text(result, { lineGap: 4, align: 'left' });
    doc.end();

  } catch (err) {
    console.error("Error during processing:", err.message);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
