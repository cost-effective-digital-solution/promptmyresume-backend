const axios = require('axios');

async function generateResume(data) {
  const prompt = `Create a professional, ATS-friendly resume and cover letter for the following information:
  Name: ${data.fullName}
  Job Title: ${data.jobTitle}
  Experience Level: ${data.experienceLevel}
  Skills: ${data.skills}
  Achievements: ${data.achievements}
  Preferred Tone: ${data.tone}
  Company: ${data.companyName}
  Motivation: ${data.motivation}
  Strengths: ${data.strengths}
  Generate in international format and ensure both Resume and Cover Letter are included.`;

  const headers = {
    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post('https://api.deepseek.com/v1/completions', {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    }, { headers });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('API error:', error.response?.data || error.message);
    throw new Error('AI generation failed');
  }
}

module.exports = { generateResume };
