const { GoogleGenAI, Type } = require('@google/genai'); // Type variable ko import kiya
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const evaluateAnswer = async (question, userAnswer, correctAnswer) => {
  try {
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
        // Direct, bulletproof object assignment using standard native types
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { 
              type: Type.INTEGER, 
              description: "Technical assessment score between 0 and 100." 
            },
            feedback: { 
              type: Type.STRING, 
              description: "Dynamic, concise technical evaluation and areas of improvement." 
            }
          },
          required: ["score", "feedback"]
        }
      },
    });

    // Safe unified text extractor
    let text = "";
    if (typeof response.text === "function") {
      text = await response.text();
    } else if (response.text) {
      text = response.text;
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
    
    // Fallback message to prevent user UI crashes
    return {
      score: 0,
      feedback: "AI Evaluation temporary sync pause. Checking server schema connection.",
    };
  }
};

module.exports = {
  evaluateAnswer,
};
