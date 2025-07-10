
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

async function getAIResumeContent(formData) {
  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_API_KEY_HERE",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: `Generate a professional resume summary for the following candidate:\n
Full Name: ${formData.fullName}
Job Title: ${formData.jobTitle}
Experience: ${formData.experienceLevel}
Skills: ${formData.skills}
Achievements: ${formData.achievements}
Tone: ${formData.tone}
Company: ${formData.companyName}
Motivation: ${formData.motivation}
Strengths: ${formData.strengths}`
          }
        ]
      })
    });

    const result = await response.json();
    return result.choices?.[0]?.message?.content || "AI content could not be generated.";
  } catch (err) {
    console.error("AI generation error:", err);
    return "Error generating AI content.";
  }
}

app.post("/api/generate", async (req, res) => {
  const data = req.body;
  const aiContent = await getAIResumeContent(data);

  const doc = new PDFDocument();
  const filename = `${(data.fullName || "resume").replace(/\s+/g, "_")}.pdf`;

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  doc.fontSize(20).text("PromptMyResume: AI-Powered Resume", { align: 'center' });
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

  doc.moveDown().fontSize(14).text("🔍 AI-Generated Summary:", { underline: true });
  doc.moveDown().fontSize(12).text(aiContent || "No AI content generated.");

  doc.end();
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
