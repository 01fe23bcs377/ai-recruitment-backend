const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    resume: { type: String, required: true }, // filename
    uploadedAt: { type: Date, default: Date.now },
    status: { type: String, default: "Pending" }, 
    skills: { type: [String], default: [] }, 
    experience: { type: String, default: "" }, 
    education: { type: String, default: "" }
});

module.exports = mongoose.model("Candidate", candidateSchema);
