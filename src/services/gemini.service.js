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
      model: "gemini-2.5-flash", // Correct stable model mapping
      contents: prompt,
      config: {
        responseMimeType: "application/json" // Strict structural enforcement
      }
    });

    // FIXED: GoogleGenAI SDK returns text via .text() method, not a plain property
    const text = response.text ? response.text() : "";

    if (!text || !text.trim()) {
      throw new Error("Received empty text string from Gemini API Client response structure.");
    }

    const clean = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(clean);

    return {
      score: typeof parsedData.score === "number" ? parsedData.score : 0,
      feedback: parsedData.feedback || "Feedback processed by AI evaluation."
    };

  } catch (error) {
    console.log("========== GEMINI ERROR ==========");
    console.error(error);

    return {
      score: 0,
      feedback: "AI evaluation failed due to parsing setup. Please review manually.",
    };
  }
};

module.exports = {
  evaluateAnswer,
};
