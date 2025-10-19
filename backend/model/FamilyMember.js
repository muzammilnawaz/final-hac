import mongoose from 'mongoose';

const familyMemberSchema = mongoose.Schema(
  {
    user: {
      // Yeh main user hai (jo account chala raha hai)
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    relationship: {
      type: String,
      required: true, // e.g., 'Father', 'Mother', 'Spouse'
    },
    dob: {
      type: Date, // Date of Birth
    },
    notes: {
      type: String, // e.g., 'Allergic to penicillin', 'Blood Group: B+'
    },
  },
  {
    timestamps: true,
  }
);

const FamilyMember = mongoose.model('FamilyMember', familyMemberSchema);
export default FamilyMember;