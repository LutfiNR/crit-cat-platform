import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // --- Field untuk Login (Wajib untuk Semua) ---
  username: {
    type: String,
    required: [true, 'Username tidak boleh kosong.'],
    unique: true, // Username tidak boleh sama antar pengguna
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password tidak boleh kosong.'],
  },

  // --- Field Umum (Untuk Guru & Siswa) ---
  name: {
    type: String,
    required: [true, 'Nama tidak boleh kosong.'],
  },
  school: {
    type: String,
    required: [true, 'Asal sekolah tidak boleh kosong.'],
  },
  role: {
    type: String,
    required: true,
    enum: ['guru', 'siswa'], // Nilai hanya boleh 'guru' atau 'siswa'
  },

  // --- Field Khusus Siswa ---
  nis: { // Nomor Induk Siswa
    type: String,
    // Field ini hanya wajib diisi jika rolenya adalah 'siswa'
    required: function() { return this.role === 'siswa'; },
  },
  kelas: {
    type: String,
    // Field ini hanya wajib diisi jika rolenya adalah 'siswa'
    required: function() { return this.role === 'siswa'; },
  },
}, {
  // Opsi untuk otomatis menambahkan field `createdAt` dan `updatedAt`
  timestamps: true
});

// Mencegah Mongoose membuat ulang model jika sudah ada (best practice di Next.js)
export default mongoose.models.User || mongoose.model('User', UserSchema);