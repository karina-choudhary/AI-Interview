const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const evaluateAnswer = async (question, userAnswer, correctAnswer) => {
  try {
    // Clean Prompt: System instructions and examples are removed to prevent schema conflicts
    const prompt = `You are an expert tech interviewer AI. 
Evaluate the candidate's answer based on the provided reference solution.

Question: ${question} 
Candidate Answer: ${userAnswer} 
Reference Answer: ${correctAnswer}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Force the model engine to strictly conform to your payload properties
        responseSchema: {
          type: "OBJECT",
          properties: {
            score: { 
              type: "INTEGER", 
              description: "Technical assessment score between 0 and 100." 
            },
            feedback: { 
              type: "STRING", 
              description: "Dynamic, concise technical evaluation and areas of improvement." 
            }
          },
          required: ["score", "feedback"]
        }
      },
    });

    // Flexible multi-channel string extraction
    let text = "";
    if (typeof response.text === "function") {
      text = await response.text();
    } else if (response.text) {
      text = response.text;
    } else {
      text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    if (!text || !text.trim()) {
      throw new Error("Gemini returned empty response.");
    }

    // Since the API enforces configuration at the engine level,
    // the system natively passes clean raw string structures.
    const parsedData = JSON.parse(text.trim());

    return {
      score: typeof parsedData.score === "number" ? parsedData.score : Number(parsedData.score) || 0,
      feedback: parsedData.feedback ? String(parsedData.feedback).trim() : "No feedback returned by AI.",
    };

  } catch (error) {
    console.error("========== GEMINI INTEGRATION FAULT ==========");
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
