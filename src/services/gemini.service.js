const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Utility Helper: Request throttle mechanism to prevent 429 RPM spikes
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Individual Evaluation Handler
 */
const evaluateAnswer = async (question, userAnswer, correctAnswer) => {
  try {
    const prompt = `You are an expert tech interviewer AI. 
Evaluate the candidate's answer based on the provided reference solution.

Question: ${question} 
Candidate Answer: ${userAnswer} 
Reference Answer: ${correctAnswer}`;

    const response = await ai.models.generateContent({
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

    return JSON.parse(text.trim());

  } catch (error) {
    console.error("========== SINGLE ITEM EVALUATION ERROR ==========");
    console.error(error);
    // Safe item fallback boundary container
    return {
      score: 0,
      feedback: `Item evaluation failed: ${error.message || "Unknown context"}`
    };
  }
};

/**
 * Main Controller Loop: Processes array of questions sequentially
 * Pass your array of answers/questions here from the request body.
 */
const processFullInterview = async (questionsArray) => {
  const finalReport = [];
  let aggregateScore = 0;

  console.log(`Starting interview batch processing. Total Items: ${questionsArray.length}`);

  for (let i = 0; i < questionsArray.length; i++) {
    const item = questionsArray[i];
    console.log(`Evaluating Question ${i + 1}/${questionsArray.length}...`);

    // Execute engine execution cycle securely
    const evaluation = await evaluateAnswer(
      item.question || item.questionText,
      item.userAnswer || item.candidateAnswer,
      item.correctAnswer || item.referenceAnswer
    );

    // Append response schema payload data details
    finalReport.push({
      question: item.question || item.questionText,
      userAnswer: item.userAnswer || item.candidateAnswer,
      correctAnswer: item.correctAnswer || item.referenceAnswer,
      score: evaluation.score,
      feedback: evaluation.feedback
    });

    aggregateScore += evaluation.score;

    // Strict Enforcement: Add a 2-second pause between item loops 
    // to strictly respect Gemini Free Tier per-minute thresholds
    if (i < questionsArray.length - 1) {
      console.log("Throttling active: Waiting 2000ms for next item call...");
      await delay(2000);
    }
  }

  const overallScore = Math.round(aggregateScore / questionsArray.length);

  return {
    overallScore,
    totalQuestions: questionsArray.length,
    report: finalReport
  };
};

module.exports = {
  evaluateAnswer,
  processFullInterview
};
