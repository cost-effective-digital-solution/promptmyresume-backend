
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/generate", (req, res) => {
  const data = req.body;

  const doc = new PDFDocument();
  let filename = encodeURIComponent(data.fullName || "resume") + ".pdf";

  res.setHeader("Content-disposition", 'attachment; filename="' + filename + '"');
  res.setHeader("Content-type", "application/pdf");

  doc.pipe(res);

  doc.fontSize(20).text("Resume", { align: 'center' });
  doc.moveDown();
  doc.fontSize(12);
  doc.text("Name: " + (data.fullName || "Not provided"));
  doc.text("Email: " + (data.email || "Not provided"));
  doc.text("Job Title: " + (data.jobTitle || "Not provided"));
  doc.text("Experience Level: " + (data.experienceLevel || "Not provided"));
  doc.text("Skills: " + (data.skills || "Not provided"));
  doc.text("Achievements: " + (data.achievements || "Not provided"));
  doc.text("Tone: " + (data.tone || "Not provided"));
  doc.text("Company: " + (data.companyName || "Not provided"));
  doc.text("Motivation: " + (data.motivation || "Not provided"));
  doc.text("Strengths: " + (data.strengths || "Not provided"));

  doc.end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
