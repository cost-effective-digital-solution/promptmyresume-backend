# PromptMyResume Backend

This is the Node.js backend for PromptMyResume — an AI-powered resume PDF generator using DeepSeek API and PDFKit.

## Setup

1. Clone the repo
2. Run `npm install`
3. Add `.env` with your DeepSeek API key:

```
DEEPSEEK_API_KEY=your_actual_api_key
```

4. Start server:

```
npm start
```

## Deploying to Render

- Use Node 18+
- Set `DEEPSEEK_API_KEY` as environment variable in Render dashboard
- Build Command: `npm install`
- Start Command: `npm start`

## API

POST `/api/generate`  
Returns a downloadable PDF resume with AI-generated summary.
