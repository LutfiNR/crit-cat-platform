// /src/app/api/tests/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Test from '@/models/Test';

// --- GET: Mengambil daftar tes milik guru yang login ---
export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'guru') {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  try {
    // Cari semua tes yang field 'createdBy'-nya cocok dengan ID user yang login
    const tests = await Test.find({ createdBy: session.user.id })
      .populate('questions', 'subject tier1Text') // Ambil info dasar dari soal-soal
      .sort({ createdAt: -1 }); // Urutkan dari yang terbaru

    return NextResponse.json({ success: true, tests });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal mengambil daftar tes.' }, { status: 500 });
  }
}

// --- POST: Membuat satu tes baru ---
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'guru') {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  try {
    const { title, description, accessCode, duration, questions, status } = await request.json();

    // Validasi sederhana
    if (!title || !accessCode || !duration || !questions) {
      return NextResponse.json({ message: 'Field wajib tidak lengkap' }, { status: 400 });
    }

    // Cek duplikasi accessCode
    const existingTest = await Test.findOne({ accessCode });
    if (existingTest) {
      return NextResponse.json({ message: 'Kode akses sudah digunakan.' }, { status: 409 });
    }

    const newTest = new Test({
      title,
      description,
      accessCode,
      duration,
      questions,
      status,
      createdBy: session.user.id,
    });

    await newTest.save();
    return NextResponse.json({ success: true, message: 'Tes berhasil dibuat.', data: newTest }, { status: 201 });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return NextResponse.json({ success: false, message: 'Data tidak valid.', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Gagal membuat tes.' }, { status: 500 });
  }
}