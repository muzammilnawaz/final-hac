import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeMedicalReport = async (fileBuffer, mimeType) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are 'HealthMate', an AI assistant analyzing a medical report.
      Provide the following in a strict JSON format. DO NOT add "json" or backticks.

      Your JSON response must have these exact keys:
      1. "summary" (string): Simple English summary.
      2. "romanUrdu" (string): Simple Roman Urdu summary.
      3. "abnormalValues" (array of objects): List high/low values. Each object: "parameter", "value", "status". If none, return [].
      4. "doctorQuestions" (array of strings): 3-5 questions to ask the doctor.
      5. "foodSuggestions" (string): Foods to eat or avoid.
      6. "remedies" (string): Simple home remedies.
      7. "disclaimer" (string): "AI is for understanding only. Always consult your doctor."
    `;

    const fileToProcess = {
      inlineData: {
        data: fileBuffer.toString('base64'),
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, fileToProcess]);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);

  } catch (error) {
    console.error('Error analyzing with Gemini:', error);
    throw new Error('Failed to analyze report with AI.');
  }
};