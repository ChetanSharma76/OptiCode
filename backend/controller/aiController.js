import axios from 'axios';
import dotenv from 'dotenv';
import Problem from '../model/problemModel.js';
dotenv.config();

const reviewCode = async (req, res) => {
  const { code, language, problemId } = req.body;

  const problemInfo = await Problem.find({_id:problemId})
    .select('description constraints inputFormat outputFormat samples');

  if (!problemInfo) {
    return res.status(404).json({ success: false, message: 'Problem not found' });
  }

  if( !code || !language || code === '// Write your code here...' ) {
    return res.status(400).json({ success: false, message: 'Code and language are required' });
  }

  console.log(problemInfo[0].description);
  
  const fallbackPrompt = `
  Here is a problem explain and solve this first then code in ${language}:

  Description:
  ${problemInfo[0].description}

  Constraints:
  ${problemInfo[0].constraints}
  `;

  const prompt = `
  You're an AI code reviewer. The language is ${language}.
  Analyze the code below. Your response should include:
  1. Any syntax or logical errors.
  2. Suggestions for improvement.
  3. Optimized versions (if possible).
  4. Overall feedback.
  Use bullet points and markdown format for better readability, and give a crisp and concise response.

  Here is the code:
  \`\`\`${language}
  ${code}
  \`\`\`
  ` ;


  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No meaningful response from Gemini.';

    res.status(200).json({ review: reply });
  } catch (error) {
    console.error('Gemini API error:', error.message);
    res.status(500).json({ error: 'Failed to get AI review.' });
  }
};

export default reviewCode;
