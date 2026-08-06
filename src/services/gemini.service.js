const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const evaluateAnswer = async (question, userAnswer, correctAnswer) => {
  try {
    const prompt = `You are an expert tech interviewer AI. 
Evaluate the candidate's answer based on the provided reference solution.

Question: ${question} 
Candidate Answer: ${userAnswer} 
Reference Answer: ${correctAnswer}`;

    const response = await ai.models.generateContent({
      // FIXED: Google's updated stable flagship model used to clear 404 blockages
      model: "gemini-2.0-flash", 
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            score: { 
              type: "integer", 
              description: "Technical assessment score between 0 and 100." 
            },
            feedback: { 
              type: "string", 
              description: "Dynamic, concise technical evaluation and areas of improvement." 
            }
          },
          required: ["score", "feedback"]
        }
      },
    });

    let text = "";
    if (response.text) {
      text = typeof response.text === "function" ? await response.text() : response.text;
    } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = response.candidates[0].content.parts[0].text;
    }

    if (!text || !text.trim()) {
      throw new Error("Gemini returned empty response payload.");
    }

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
      feedback: `CRITICAL INTEGRATION ERROR: ${error.message || "Unknown error context"}`
    };
  }
};

module.exports = {
  evaluateAnswer,
};
