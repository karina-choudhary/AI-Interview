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
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json" // Core level par JSON force karega
      }
    });

    let text = response.text ? response.text() : "";

    if (!text || !text.trim()) {
      throw new Error("Empty response from Gemini API");
    }

    // Terminal me check karne ke liye raw text print karein
    console.log("--- RAW GEMINI RESPONSE ---");
    console.log(text);
    console.log("----------------------------");

    // 100% Safe Extraction: JSON string ko '{' aur '}' ke beech se dhoodh kar nikalna
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("Valid JSON structure not found in AI response");
    }

    const cleanJson = text.substring(firstBrace, lastBrace + 1);
    const parsedData = JSON.parse(cleanJson);

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
