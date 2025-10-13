// /src/app/api/submissions/[submissionId]/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Submission from '@/models/Submission';
import Test from '@/models/Test'; // Diperlukan untuk cek kepemilikan
import Question from '@/models/Question'; // Penting agar populate berfungsi

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Tidak terautentikasi" }, { status: 401 });
  }

  await dbConnect();
  try {
    const { submissionId } = await params;

    const submission = await Submission.findById(submissionId)
      .populate('testId', 'title createdBy') // Ambil judul tes & ID pembuatnya
      // Populate bertingkat: ambil detail soal di dalam responseHistory
      .populate({
        path: 'responseHistory.questionId',
        model: Question, // Tentukan model yang akan digunakan untuk populate
      });

    if (!submission) {
      return NextResponse.json({ message: "Hasil tes tidak ditemukan" }, { status: 404 });
    }

    // --- Logika Otorisasi (Keamanan) ---
    const isOwner = submission.userId.toString() === session.user.id;
    const isTeacher = session.user.role === 'guru';
    // Pengecekan tambahan: apakah guru adalah pemilik tes dari submission ini
    const isTestCreator = isTeacher && submission.testId.createdBy.toString() === session.user.id;

    if (!isOwner && !isTestCreator) {
        return NextResponse.json({ message: "Anda tidak memiliki akses ke hasil tes ini" }, { status: 403 });
    }

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error("Get Submission Detail Error:", error);
    return NextResponse.json({ success: false, message: "Gagal mengambil data hasil tes" }, { status: 500 });
  }
}
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  // Hanya guru yang boleh menghapus submission
  if (session?.user?.role !== 'guru') {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  try {
    const { submissionId } = params;
    
    // Keamanan: Pastikan guru adalah pemilik tes dari submission ini
    const submission = await Submission.findById(submissionId).populate('testId', 'createdBy');
    if (!submission) {
      return NextResponse.json({ message: "Submission tidak ditemukan" }, { status: 404 });
    }
    if (submission.testId.createdBy.toString() !== session.user.id) {
        return NextResponse.json({ message: "Anda tidak berhak menghapus submission ini" }, { status: 403 });
    }

    // Lakukan penghapusan
    await Submission.findByIdAndDelete(submissionId);

    return NextResponse.json({ success: true, message: "Hasil pengerjaan siswa berhasil dihapus." });
  } catch (error) {
    console.error("Delete Submission Error:", error);
    return NextResponse.json({ success: false, message: "Gagal menghapus hasil pengerjaan." }, { status: 500 });
  }
}
