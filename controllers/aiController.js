const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Candidate = require("../models/Candidate");

// Parse a single resume
exports.parseResume = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find candidate by ID
        const candidate = await Candidate.findById(id);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        
        // Get file path
        const filePath = path.join(__dirname, "../uploads/", candidate.resume);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Resume file not found" });
        }
        
        // Parse PDF file
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        
        // Extract skills (mock implementation)
        const skills = extractSkills(data.text);
        
        // Extract experience (mock implementation)
        const experience = extractExperience(data.text);
        
        // Extract education (mock implementation)
        const education = extractEducation(data.text);
        
        // Update candidate with parsed data
        const updatedCandidate = await Candidate.findByIdAndUpdate(
            id,
            {
                skills,
                experience,
                education,
                status: "Parsed"
            },
            { new: true }
        );
        
        res.status(200).json({
            message: "Resume parsed successfully",
            candidate: updatedCandidate
        });
    } catch (error) {
        console.error("Parse resume error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Batch parse resumes
exports.batchParseResumes = async (req, res) => {
    try {
        // Get all unparsed candidates
        const candidates = await Candidate.find({ status: { $ne: "Parsed" } });
        
        const results = [];
        
        // Parse each candidate's resume
        for (const candidate of candidates) {
            try {
                // Get file path
                const filePath = path.join(__dirname, "../uploads/", candidate.resume);
                
                // Check if file exists
                if (!fs.existsSync(filePath)) {
                    results.push({
                        candidateId: candidate._id,
                        success: false,
                        error: "File not found"
                    });
                    continue;
                }
                
                // Parse PDF file
                const dataBuffer = fs.readFileSync(filePath);
                const data = await pdfParse(dataBuffer);
                
                // Extract skills (mock implementation)
                const skills = extractSkills(data.text);
                
                // Extract experience (mock implementation)
                const experience = extractExperience(data.text);
                
                // Extract education (mock implementation)
                const education = extractEducation(data.text);
                
                // Update candidate with parsed data
                await Candidate.findByIdAndUpdate(candidate._id, {
                    skills,
                    experience,
                    education,
                    status: "Parsed"
                });
                
                results.push({
                    candidateId: candidate._id,
                    success: true,
                    skills,
                    experience,
                    education
                });
            } catch (parseError) {
                results.push({
                    candidateId: candidate._id,
                    success: false,
                    error: parseError.message
                });
            }
        }
        
        res.status(200).json({
            message: "Batch parsing completed",
            results
        });
    } catch (error) {
        console.error("Batch parse resumes error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Helper function to extract skills from text (mock implementation)
function extractSkills(text) {
    // Common tech skills
    const commonSkills = [
        "JavaScript", "Python", "Java", "C++", "React", "Angular", "Vue", 
        "Node.js", "Express", "MongoDB", "SQL", "PostgreSQL", "AWS", 
        "Docker", "Kubernetes", "Git", "HTML", "CSS", "TypeScript",
        "Spring", "Hibernate", "Django", "Flask", "Redis", "GraphQL",
        "REST", "API", "Microservices", "Agile", "Scrum"
    ];
    
    const skills = [];
    const lowerText = text.toLowerCase();
    
    commonSkills.forEach(skill => {
        if (lowerText.includes(skill.toLowerCase())) {
            skills.push(skill);
        }
    });
    
    return [...new Set(skills)]; // Remove duplicates
}

// Helper function to extract experience from text (mock implementation)
function extractExperience(text) {
    // Look for patterns like "X years of experience" or "X+ years"
    const experienceRegex = /(\d+)\s*(\+?)\s*(years?|yrs?)/i;
    const match = text.match(experienceRegex);
    
    if (match) {
        return match[1] + (match[2] || ""); // Return the number with + if present
    }
    
    return "N/A";
}

// Helper function to extract education from text (mock implementation)
function extractEducation(text) {
    // Look for common education patterns
    const educationKeywords = [
        "Bachelor", "Master", "PhD", "BSc", "MSc", "MBA", "BS", "MS",
        "Computer Science", "Engineering", "Mathematics", "Physics"
    ];
    
    const sentences = text.split(/[.\n]/);
    for (const sentence of sentences) {
        if (educationKeywords.some(keyword => 
            sentence.toLowerCase().includes(keyword.toLowerCase())
        )) {
            return sentence.trim();
        }
    }
    
    return "Education information not found";
}
