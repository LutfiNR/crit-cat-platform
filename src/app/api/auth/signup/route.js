// /src/app/api/auth/signup/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  // Pastikan terhubung ke DB
  await dbConnect();

  try {
    // Ambil semua data dari body request
    const { username, password, name, school, role, nis, kelas } = await request.json();

    // --- Validasi Input ---
    if (!username || !password || !name || !school || !role) {
      return NextResponse.json({ message: 'Semua field wajib diisi.' }, { status: 400 });
    }

    // Validasi spesifik untuk siswa
    if (role === 'siswa' && (!nis || !kelas)) {
      return NextResponse.json({ message: 'NIS dan Kelas wajib diisi untuk siswa.' }, { status: 400 });
    }

    // --- Cek Duplikasi Username ---
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Username sudah digunakan. Harap pilih username lain.' },
        { status: 409 } // 409 Conflict
      );
    }

    // --- Enkripsi (Hash) Password ---
    // Angka 12 adalah "salt rounds", standar keamanan yang baik
    const hashedPassword = await bcrypt.hash(password, 12);

    // --- Siapkan Data untuk Disimpan ---
    const newUserPayload = {
      username,
      password: hashedPassword,
      name,
      school,
      role,
    };

    // Tambahkan field khusus siswa jika rolenya adalah 'siswa'
    if (role === 'siswa') {
      newUserPayload.nis = nis;
      newUserPayload.kelas = kelas;
    }

    // Buat dokumen user baru menggunakan Model
    const newUser = new User(newUserPayload);

    // --- Simpan ke Database ---
    await newUser.save();

    return NextResponse.json(
      { message: 'Pendaftaran akun berhasil!' },
      { status: 201 } // 201 Created
    );

  } catch (error) {
    // Tangani error jika data tidak sesuai skema Mongoose
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: 'Data tidak valid.', errors: error.errors }, { status: 400 });
    }
    // Tangani error server lainnya
    console.error("Signup API Error:", error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}