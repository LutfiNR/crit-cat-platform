import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route'; // Sesuaikan path jika berbeda
import dbConnect from '@/lib/dbConnect';
import Question from '@/models/Question';
import Test from '@/models/Test';
import Submission from '@/models/Submission';

// --- GET: Mengambil semua soal ---
export async function GET() {
  const session = await getServerSession(authOptions);
  // Siapa pun yang login (guru/siswa) boleh melihat semua soal
  if (!session) {
    return NextResponse.json({ message: "Tidak terautentikasi" }, { status: 401 });
  }

  await dbConnect();
  try {
    const questions = await Question.find({}).sort({ subject: 1, createdAt: -1 });
    return NextResponse.json({ success: true, questions });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Gagal mengambil soal.' }, { status: 500 });
  }
}

// --- POST: Menambah satu soal baru ---
export async function POST(request) {
  const session = await getServerSession(authOptions);
  // Proteksi: Hanya 'guru' yang boleh membuat soal
  if (session?.user?.role !== 'guru') {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  try {
    const questionData = await request.json();
    const newQuestion = new Question(questionData);
    await newQuestion.save();
    return NextResponse.json({ success: true, message: 'Soal berhasil ditambahkan.', data: newQuestion }, { status: 201 });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return NextResponse.json({ success: false, message: 'Data tidak valid.', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Gagal menambahkan soal.' }, { status: 500 });
  }
}