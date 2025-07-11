
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/generate", async (req, res) => {
  const data = req.body;

  const prompt = `You are a certified resume and cover letter writing expert with deep understanding of ATS standards and global hiring expectations. Based on the provided profile, generate:

1. A professionally formatted, ATS-friendly resume with clearly defined sections including:
   - Title: Resume (center-aligned and bold)
   - Full Name and Contact Info (email optional)
   - Professional Summary
   - Skills
   - Professional Experience (with job titles, companies, dates, responsibilities, and achievements)
   - Education
   - Additional Sections (if relevant: Certifications, Languages, Projects, etc.)

2. A tailored and compelling cover letter, addressed to the hiring manager at the specified company, matching the tone and target role. The cover letter should:
   - Include a greeting
   - Mention the job title and company
   - Reflect motivation, strengths, and achievements
   - Close with a call to action and thank you

Format the output with two distinct, clearly separated sections, using proper line spacing, professional layout, and bold section titles (no asterisks, symbols, or markdown code).

---

Profile Information:
- Full Name: ${data.fullName}
- Job Title: ${data.jobTitle}
- Experience Level: ${data.experienceLevel}
- Skills: ${data.skills}
- Achievements: ${data.achievements}
- Tone: ${data.tone}
- Target Company: ${data.companyName}
- Motivation: ${data.motivation}
- Strengths: ${data.strengths}
`;

  const doc = new PDFDocument();
  let filename = encodeURIComponent(data.fullName || "resume") + ".pdf";

  res.setHeader("Content-disposition", 'attachment; filename="' + filename + '"');
  res.setHeader("Content-type", "application/pdf");

  doc.pipe(res);

  doc.fontSize(18).text("PromptMyResume: AI-Powered Resume", { align: "center" });
  doc.moveDown();

  doc.fontSize(12);
  doc.text("Full Name: " + (data.fullName || "N/A"));
  doc.text("Email: " + (data.email || "N/A"));
  doc.text("Job Title: " + (data.jobTitle || "N/A"));
  doc.text("Experience Level: " + (data.experienceLevel || "N/A"));
  doc.text("Skills: " + (data.skills || "N/A"));
  doc.text("Achievements: " + (data.achievements || "N/A"));
  doc.text("Tone: " + (data.tone || "N/A"));
  doc.text("Company: " + (data.companyName || "N/A"));
  doc.text("Motivation: " + (data.motivation || "N/A"));
  doc.text("Strengths: " + (data.strengths || "N/A"));

  doc.moveDown();
  doc.fontSize(14).text("AI-Generated Summary:", { underline: true });
  doc.fontSize(12).text("Coming Soon..."); // Simulated for now

  doc.end();

  // Simulate email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "costeffectivedigitalsolution@gmail.com",
      pass: "your-email-password" // Use app-specific password
    }
  });

  const mailOptions = {
    from: "costeffectivedigitalsolution@gmail.com",
    to: data.email || "costeffectivedigitalsolution@gmail.com",
    subject: "Resume & Cover Letter Generated",
    text: `Hi ${data.fullName},

Your resume and cover letter have been successfully generated.

Best,
PromptMyResume`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email failed:", error.message);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
