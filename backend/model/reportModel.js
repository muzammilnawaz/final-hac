import mongoose from 'mongoose';

const reportSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    reportName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    filePublicId: { type: String, required: true },
    
    // Data from Gemini
    aiSummary: { type: String },
    aiRomanUrdu: { type: String },
    doctorQuestions: [{ type: String }],
    foodSuggestions: { type: String },
    remedies: { type: String },

    // ---- YEH NAYA FIELD ADD HUA HAI ----
    // Yeh report kis family member ki hai?
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FamilyMember', // FamilyMember model se link
      required: false, // Zaroori nahi, ho sakta hai user ki apni ho
    },
    // ------------------------------------
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;