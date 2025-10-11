// /src/models/Test.js

import mongoose from 'mongoose';

const TestSchema = new mongoose.Schema({
  // Judul tes, misal: "Ujian Logika Dasar Bab 1"
  title: {
    type: String,
    required: [true, 'Judul tes tidak boleh kosong.'],
    trim: true,
  },
  // Deskripsi singkat mengenai tes (opsional)
  description: {
    type: String,
    trim: true,
  },
  // Token/kode unik yang akan digunakan siswa untuk masuk ke tes ini
  accessCode: {
    type: String,
    required: [true, 'Kode akses tidak boleh kosong.'],
    unique: true, // Setiap tes punya kode akses yang berbeda
    trim: true,
  },
  // Durasi pengerjaan tes dalam satuan MENIT
  duration: {
    type: Number,
    required: [true, 'Durasi tes tidak boleh kosong.'],
  },
  // Daftar soal yang ada di dalam tes ini.
  // Ini adalah array yang berisi ID dari dokumen-dokumen soal.
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question', // Merujuk ke model 'Question'
  }],
  // ID guru yang membuat tes ini
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Merujuk ke model 'User'
    required: true,
  },
  // Status tes, apakah masih draft atau sudah bisa diakses
  status: {
      type: String,
      enum: ['draft', 'published']
  }
}, {
  timestamps: true
});

export default mongoose.models.Test || mongoose.model('Test', TestSchema);