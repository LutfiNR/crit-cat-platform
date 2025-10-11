import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
});

const QuestionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  imagelink: { type: String },
  tier1Text: { type: String, required: true },
  tier1Options: [OptionSchema],
  tier2Text: { type: String, required: true },
  tier2Options: [OptionSchema],
  correctTier1: { type: String, required: true },
  correctTier2: { type: String, required: true },
  difficulty: { type: Number, required: true },
  difficultySecondary: { type: Number, required: true },
  difficultyTertiary: { type: Number, required: true },
  difficultyQuaternary: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);