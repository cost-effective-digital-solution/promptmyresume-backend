
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/generate', async (req, res) => {
  const formData = req.body;

 const prompt = `You are a certified resume and cover letter writing expert with deep understanding of ATS standards and global hiring expectations. Based on the provided profile, generate:

1. A *professionally formatted, ATS-friendly resume* with clearly defined sections including:
   - Title: Resume (center-aligned and bold)
   - Full Name and Contact Info (email optional)
   - Professional Summary
   - Skills
   - Professional Experience (with job titles, companies, dates, responsibilities, and achievements)
   - Education
   - Additional Sections (if relevant: Certifications, Languages, Projects, etc.)

2. A **tailored and compelling cover letter**, addressed to the hiring manager at the specified company, matching the tone and target role. The cover letter should:
   - Include a greeting
   - Mention the job title and company
   - Reflect motivation, strengths, and achievements
   - Close with a call to action and thank you

Format the output with **two distinct, clearly separated sections**, using proper line spacing, professional layout, and bold section titles (no asterisks, symbols, or markdown code).

---

Resume
[Insert ATS-formatted resume with proper headings and bold titles]

---

Cover Letter
[Insert cover letter here, properly spaced and structured in paragraph form]

---

Profile Information:
- Full Name: ${formData.fullName}
- Job Title: ${formData.jobTitle}
- Experience Level: ${formData.experienceLevel}
- Skills: ${formData.skills}
- Achievements: ${formData.achievements}
- Tone: ${formData.tone}
- Target Company: ${formData.companyName}
- Motivation: ${formData.motivation}
- Strengths: ${formData.strengths}`;

  // Simulating resume and cover letter generation (replace with actual AI call)
  const generatedContent = prompt.replace(/\$\{(.*?)\}/g, (_, key) => formData[key.trim()] || '');

  res.json({ resume: generatedContent, coverLetter: generatedContent });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port {PORT}`);
});
