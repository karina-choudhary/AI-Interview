const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const evaluateAnswer = async (question, userAnswer, correctAnswer) => {
  try {
    const prompt = `
You are an AI Interviewer.

Question:
${question}

Candidate Answer:
${userAnswer}

Reference Answer:
${correctAnswer}

Evaluate the candidate.

Return ONLY valid JSON in this format:

{
  "score": 85,
  "feedback": "Short feedback"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    const text = response.text;

    const clean = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(clean);

  } catch (error) {
    console.log("========== GEMINI ERROR ==========");
    console.log(error);

    return {
      score: 0,
      feedback: "AI evaluation failed.",
    };
  }
};

module.exports = {
  evaluateAnswer,
};