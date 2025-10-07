import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
});

const QuestionSchema = new mongoose.Schema({
  // Topik atau subjek dari soal, untuk memudahkan filtering di Bank Soal
  // Contoh: "Logika Proposisional", "Silogisme", "Penalaran Analitis"
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  tier1Text: { type: String, required: true },
  tier1Options: [OptionSchema],
  tier2Text: { type: String, required: true },
  tier2Options: [OptionSchema],
  correctTier1: { type: String, required: true },
  correctTier2: { type: String, required: true },
  difficulty: { type: Number, required: true }, // Nilai-b
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);