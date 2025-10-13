import mongoose from 'mongoose';

const ResponseHistorySchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  questionDifficulty:{
    difficulty: { type: Number, required: true },
    difficultySecondary: { type: Number, required: true },
    difficultyTertiary: { type: Number, required: true },
    difficultyQuaternary: { type: Number, required: true },
  },
  answerTier1: { type: String, required: true },
  answerTier2: { type: String, required: true },
  score: { type: Number, required: true },
  pCorrect: {
    pCorrect: { type: Number, required: true },
    pCorrect0: { type: Number, required: true },
    pCorrect1: { type: Number, required: true },
    pCorrect2: { type: Number, required: true },
    pCorrect3: { type: Number, required: true },
  },
  pWrong: { type: Number, required: true },
  informationItem: { type: Number, required: true },
  thetaBefore: { type: Number, required: true },
  thetaAfter: { type: Number, required: true },
  se: { type: Number, required: true },
  seDifference: { type: Number, default: null },
}, { _id: false, timestamps: { createdAt: true, updatedAt: false } });

const SubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Merujuk ke model 'User'
    required: true,
    index: true,
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test', // Merujuk ke model 'Test'
    required: true,
    index: true,
  },
  userInfo: {
    name: { type: String, required: true },
    school: { type: String, required: true },
    kelas: { type: String, required: true },
    nis: { type: String, required: true },
    accessCode: { type: String, required: true },
  },
  testStartTime: { type: Date, required: true },
  testFinishTime: { type: Date, required: true },
  finalTheta: { type: Number, required: true },
  stoppingRule: { type: String, enum: ['TIME_WASTED', 'NO_MORE_QUESTIONS', 'SE_DIFFERENCE', 'LEFT_TAB'], required: true },
  responseHistory: [ResponseHistorySchema],
}, { timestamps: true });

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);