import mongoose from 'mongoose';

const vitalSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    bp: { type: String }, // e.g., "120/80"
    sugar: { type: Number },
    weight: { type: Number },
    notes: { type: String },

    // ---- YEH NAYA FIELD ADD HUA HAI ----
    // Yeh vitals kis family member ke hain?
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FamilyMember', // FamilyMember model se link
      required: false, // Zaroori nahi, ho sakta hai user ke apne hon
    },
    // ------------------------------------
  },
  { timestamps: true }
);

const Vital = mongoose.model('Vital', vitalSchema);
export default Vital;