const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const evaluateAnswer = async (question, userAnswer, correctAnswer) => {
  try {
    const prompt = `You are an expert tech interviewer AI. 
Question: ${question} 
Candidate Answer: ${userAnswer} 
Reference Answer: ${correctAnswer} 
Evaluate the candidate's answer based on the reference solution. 
Return ONLY a valid single-line stringified JSON object matching this exact schema: 
{ "score": 85, "feedback": "Write dynamic concise technical evaluation here." }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    // SDK compatibility handling (Naya code check)
    let text;
    if (typeof response.text === "function") {
      text = await response.text();
    } else if (response.text) {
      text = response.text;
    } else {
      text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    console.log("========== RAW GEMINI RESPONSE ==========");
    console.log(text);
    console.log("=========================================");

    if (!text || !text.trim()) {
      throw new Error("Gemini returned empty response.");
    }

    // Remove markdown formatting
    let sanitizedText = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Secure boundary extraction
    const firstBrace = sanitizedText.indexOf("{");
    const lastBrace = sanitizedText.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("JSON object not found in Gemini response.");
    }

    let jsonText = sanitizedText.slice(firstBrace, lastBrace + 1);

    // Clean invisible non-printable/control characters that cause JSON.parse crashes
    jsonText = jsonText.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

    console.log("========== PARSED JSON ==========");
    console.log(jsonText);
    console.log("=================================");

    const parsedData = JSON.parse(jsonText);

    return {
      score: Number(parsedData.score) || 0,
      feedback: parsedData.feedback ? String(parsedData.feedback).trim() : "No feedback returned by AI.",
    };

  } catch (error) {
    console.log("========== GEMINI ENGINE FAULT ==========");
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
