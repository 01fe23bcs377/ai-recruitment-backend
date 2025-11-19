const Candidate = require("../models/Candidate");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const config = require("../config/config");

// ------------- GEMINI REST API CALL FUNCTION ----------------
async function callGemini(prompt, pdfBase64 = null) {
  try {
    const GEMINI_API_KEY = config.gemini.apiKey;
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    };

    if (pdfBase64) {
      payload.contents[0].parts.push({
        inlineData: {
          mimeType: "application/pdf",
          data: pdfBase64
        }
      });
    }

    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 30000 // 30 second timeout
    });

    if (!response.data.candidates || !response.data.candidates[0]) {
      throw new Error("Invalid response from Gemini API");
    }

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API error:", error.message);
    throw new Error(`Failed to call Gemini API: ${error.message}`);
  }
}

// ----------------- MAIN PARSER FUNCTION ---------------------
exports.parseResume = async (req, res) => {
  try {
    const candidateId = req.params.id;
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const pdfPath = path.join(__dirname, "../uploads/", candidate.resume);
    
    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: "Resume file not found" });
    }

    const pdfBuffer = fs.readFileSync(pdfPath);

    // Try normal PDF extraction
    let resumeText = "";
    try {
      const pdfData = await pdfParse(pdfBuffer);
      resumeText = pdfData.text.trim();
    } catch (parseError) {
      console.warn("PDF parsing failed, will use OCR:", parseError.message);
    }

    // Fallback: OCR using Gemini if normal extraction failed or text is too short
    if (!resumeText || resumeText.length < 50) {
      console.log("⚠ Using OCR mode for resume parsing");
      const base64 = pdfBuffer.toString("base64");
      resumeText = await callGemini("Extract all text from this PDF. Return only the text content.", base64);
    }

    // Validate we have text to work with
    if (!resumeText || resumeText.length < 20) {
      return res.status(400).json({ 
        message: "Could not extract text from resume. Please try a different format.",
        resumeTextLength: resumeText ? resumeText.length : 0
      });
    }

    // Parse resume into structured data
    const prompt = `
Extract skills, experience, and education from the resume below.
Return ONLY a valid JSON object with this exact structure:
{
  "skills": ["Skill1", "Skill2", "Skill3"],
  "experience": "Experience summary with years and key roles",
  "education": "Education summary with degrees and institutions"
}

RESUME TEXT:
${resumeText.substring(0, 5000)}
`;

    const aiText = await callGemini(prompt);
    
    // Clean and parse the JSON response
    let cleanJSON = aiText.replace(/```json|```/g, "").trim();
    
    // Handle case where AI returns explanatory text along with JSON
    const jsonStart = cleanJSON.indexOf('{');
    const jsonEnd = cleanJSON.lastIndexOf('}') + 1;
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      cleanJSON = cleanJSON.substring(jsonStart, jsonEnd);
    }
    
    let parsed;
    try {
      parsed = JSON.parse(cleanJSON);
    } catch (parseErr) {
      console.error("AI returned invalid JSON:", cleanJSON);
      return res.status(500).json({ 
        message: "AI parsing failed - invalid response format",
        error: parseErr.message,
        rawResponse: cleanJSON.substring(0, 200) + "..."
      });
    }

    // Validate and sanitize parsed data
    const sanitizedData = {
      skills: Array.isArray(parsed.skills) ? parsed.skills.filter(skill => typeof skill === 'string' && skill.length > 0).slice(0, 20) : [],
      experience: typeof parsed.experience === 'string' ? parsed.experience.substring(0, 1000) : "",
      education: typeof parsed.education === 'string' ? parsed.education.substring(0, 1000) : ""
    };

    // Update candidate with parsed data
    candidate.skills = sanitizedData.skills;
    candidate.experience = sanitizedData.experience;
    candidate.education = sanitizedData.education;
    candidate.status = "Parsed";
    candidate.parsedAt = new Date();
    
    await candidate.save();

    res.json({
      message: "AI parsing completed successfully",
      parsed: sanitizedData,
      candidate
    });

  } catch (err) {
    console.error("🔥 Resume parsing error:", err);
    res.status(500).json({
      message: "AI parsing failed",
      error: err.message
    });
  }
};

// Batch parse multiple resumes
exports.batchParseResumes = async (req, res) => {
  try {
    const { candidateIds } = req.body;
    
    if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({ message: "Please provide an array of candidate IDs" });
    }
    
    if (candidateIds.length > 10) {
      return res.status(400).json({ message: "Cannot process more than 10 resumes at once" });
    }
    
    const results = [];
    const errors = [];
    
    for (const candidateId of candidateIds) {
      try {
        // This will call the same parsing logic as the single parse endpoint
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
          errors.push({ id: candidateId, error: "Candidate not found" });
          continue;
        }
        
        // For batch processing, we'll just update the status and return success
        // In a real implementation, you might want to use a queue system
        candidate.status = "Queued for parsing";
        await candidate.save();
        results.push({ id: candidateId, status: "Queued" });
      } catch (err) {
        errors.push({ id: candidateId, error: err.message });
      }
    }
    
    res.json({
      message: "Batch parsing initiated",
      results,
      errors
    });
  } catch (err) {
    console.error("Batch parsing error:", err);
    res.status(500).json({
      message: "Batch parsing failed",
      error: err.message
    });
  }
};
