const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/generate", (req, res) => {
  const data = req.body;
  const doc = new PDFDocument();

  // Suggesting a default filename
  const filename = `${(data.fullName || "resume").replace(/\s+/g, "_")}.pdf`;

  // Set headers for download
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "application/pdf");

  // Pipe the generated PDF to the response
  doc.pipe(res);

  // Add content to the PDF
  doc.fontSize(20).text("PromptMyResume: Generated Resume", { align: 'center' });
  doc.moveDown();
  doc.fontSize(12);
  doc.text(`Full Name: ${data.fullName || "N/A"}`);
  doc.text(`Email: ${data.email || "N/A"}`);
  doc.text(`Job Title: ${data.jobTitle || "N/A"}`);
  doc.text(`Experience Level: ${data.experienceLevel || "N/A"}`);
  doc.text(`Skills: ${data.skills || "N/A"}`);
  doc.text(`Achievements: ${data.achievements || "N/A"}`);
  doc.text(`Tone: ${data.tone || "N/A"}`);
  doc.text(`Company: ${data.companyName || "N/A"}`);
  doc.text(`Motivation: ${data.motivation || "N/A"}`);
  doc.text(`Strengths: ${data.strengths || "N/A"}`);

  // Finalize PDF
  doc.end();
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
