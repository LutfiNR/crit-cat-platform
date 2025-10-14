// /src/app/api/tests/[id]/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Question from '@/models/Question';
import Test from '@/models/Test';
import Submission from '@/models/Submission';

// --- GET: Mengambil detail satu tes ---
export async function GET(request, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'guru') {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  try {
    const test = await Test.findById(id).populate('questions'); // Ambil semua detail soal
    if (!test) {
      return NextResponse.json({ message: "Tes tidak ditemukan" }, { status: 404 });
    }
    // Keamanan: Pastikan guru hanya bisa melihat tes yang ia buat sendiri
    if (test.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ message: "Anda tidak memiliki akses ke tes ini" }, { status: 403 });
    }
    return NextResponse.json({ success: true, data: test });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal mengambil data tes" }, { status: 500 });
  }
}

// --- PUT: Memperbarui satu tes ---
export async function PUT(request, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'guru') {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  try {
    const test = await Test.findById(id);
    if (!test) {
      return NextResponse.json({ message: "Tes tidak ditemukan" }, { status: 404 });
    }
    if (test.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ message: "Anda tidak memiliki akses untuk mengedit tes ini" }, { status: 403 });
    }

    const testData = await request.json();
    const updatedTest = await Test.findByIdAndUpdate(id, testData, { new: true, runValidators: true });

    return NextResponse.json({ success: true, message: "Tes berhasil diperbarui", data: updatedTest });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal memperbarui tes" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'guru') {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
  }
  
  await dbConnect();
  try {
    const test = await Test.findById(id);
    if (!test) {
        return NextResponse.json({ message: "Tes tidak ditemukan" }, { status: 404 });
    }
    if (test.createdBy.toString() !== session.user.id) {
        return NextResponse.json({ message: "Anda tidak memiliki akses untuk menghapus tes ini" }, { status: 403 });
    }

    // --- LOGIKA BARU: Hapus semua submission terkait ---
    await Submission.deleteMany({ testId: id });
    // ---------------------------------------------
    
    // Hapus tes itu sendiri
    await Test.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true, message: "Tes dan semua hasil pengerjaannya berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal menghapus tes" }, { status: 500 });
  }
}