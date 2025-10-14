// /src/app/api/questions/[id]/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route'; // Path relatif
import dbConnect from '@/lib/dbConnect';
import Question from '@/models/Question';
import Test from '@/models/Test';
import Submission from '@/models/Submission';

// --- GET: Mengambil satu soal berdasarkan ID ---
export async function GET(request, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Tidak terautentikasi" }, { status: 401 });
  }

  await dbConnect();
  try {
    const question = await Question.findById(id);
    if (!question) {
      return NextResponse.json({ success: false, message: "Soal tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: question });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal mengambil data soal" }, { status: 500 });
  }
}

// --- PUT: Memperbarui satu soal berdasarkan ID ---
export async function PUT(request, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'guru') {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  try {
    const questionData = await request.json();
    const updatedQuestion = await Question.findByIdAndUpdate(id, questionData, {
      new: true, // Mengembalikan dokumen yang sudah diperbarui
      runValidators: true, // Menjalankan validasi skema saat update
    });

    if (!updatedQuestion) {
      return NextResponse.json({ success: false, message: "Soal tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Soal berhasil diperbarui", data: updatedQuestion });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return NextResponse.json({ success: false, message: 'Data tidak valid.', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Gagal memperbarui soal" }, { status: 500 });
  }
}

// --- DELETE: Menghapus satu soal berdasarkan ID ---
export async function DELETE(request, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'guru') {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  try {
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion) {
      return NextResponse.json({ success: false, message: "Soal tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Soal berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal menghapus soal" }, { status: 500 });
  }
}