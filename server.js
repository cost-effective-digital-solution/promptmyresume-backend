
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Function to generate AI-powered content (resume + cover letter)
async function getAIResumeAndCoverLetter(formData) {
  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: `You are an expert resume and cover letter writer. Based on the following user profile, write a complete professional resume and a tailored cover letter for the desired job. Respond in two sections clearly labeled "Resume" and "Cover Letter".\n
Full Name: ${formData.fullName}
Job Title: ${formData.jobTitle}
Experience: ${formData.experienceLevel}
Skills: ${formData.skills}
Achievements: ${formData.achievements}
Tone: ${formData.tone}
Target Company: ${formData.companyName}
Motivation: ${formData.motivation}
Strengths: ${formData.strengths}`
          }
        ]
      })
    });

    const result = await response.json();
    return result.choices?.[0]?.message?.content.trim() || "AI content could not be generated.";
  } catch (err) {
    console.error("AI generation error:", err);
    return "Error generating AI content.";
  }
}

// Function to send notification email
async function sendNotificationEmail(formData) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "costeffectivedigitalsolution@gmail.com",
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: "PromptMyResume <costeffectivedigitalsolution@gmail.com>",
    to: "costeffectivedigitalsolution@gmail.com",
    subject: "📝 New Resume Generated",
    text: `A new resume was generated for ${formData.fullName} (${formData.email}). Job Title: ${formData.jobTitle}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Notification email sent.");
  } catch (error) {
    console.error("❌ Email failed:", error);
  }
}

// PDF Generation Endpoint
app.post("/api/generate", async (req, res) => {
  const data = req.body;

  const aiContent = await getAIResumeAndCoverLetter(data);
  await sendNotificationEmail(data);

  const doc = new PDFDocument();
  const filename = `${(data.fullName || "resume").replace(/\s+/g, "_")}.pdf`;

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);

  doc.fontSize(20).text("PromptMyResume: AI Resume + Cover Letter", { align: 'center' });
  doc.moveDown();
  doc.fontSize(12);
  doc.text(`Name: ${data.fullName || "N/A"}`);
  doc.text(`Email: ${data.email || "N/A"}`);
  doc.text(`Job Title: ${data.jobTitle || "N/A"}`);
  doc.text(`Experience Level: ${data.experienceLevel || "N/A"}`);
  doc.text(`Skills: ${data.skills || "N/A"}`);
  doc.text(`Achievements: ${data.achievements || "N/A"}`);
  doc.text(`Tone: ${data.tone || "N/A"}`);
  doc.text(`Company: ${data.companyName || "N/A"}`);
  doc.text(`Motivation: ${data.motivation || "N/A"}`);
  doc.text(`Strengths: ${data.strengths || "N/A"}`);

  doc.moveDown().fontSize(14).text("🧠 AI-Generated Resume + Cover Letter", { underline: true });
  doc.moveDown().fontSize(12).text(
    aiContent.replace(/\*\*/g, '').replace(/\\n/g, '\n').replace(/\n/g, '\n').trim(),
    { lineBreak: true }
  );

  doc.end();
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
