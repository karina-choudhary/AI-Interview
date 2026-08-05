const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const evaluateAnswer = async (question, userAnswer, correctAnswer) => {
  try {
    // Prompt ko simple rakha hai, guidelines ke mutabik JSON format ka description nahi dena hai
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
        // Enforcing standard lower-case JSON validation layout strings
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

    // Engine clean schema response parse framework
    const parsedData = JSON.parse(text.trim());

    return {
      score: typeof parsedData.score === "number" ? parsedData.score : Number(parsedData.score) || 0,
      feedback: parsedData.feedback ? String(parsedData.feedback).trim() : "No feedback returned by AI.",
    };

  } catch (error) {
    console.error("========== GEMINI INTEGRATION FAULT ==========");
    console.error(error);
    
    // Yahan humne message badal diya hai taaki aapko pata chale ki naya code chal raha hai ya purana!
    return {
      score: 0,
      feedback: "NEW ENGINE PARSING FAULT: Check server logs for response structure.",
    };
  }
};

module.exports = {
  evaluateAnswer,
};
