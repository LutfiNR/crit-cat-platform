// /src/app/api/submissions/history/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Question from '@/models/Question';
import Test from '@/models/Test';
import Submission from '@/models/Submission';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'siswa') {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  try {
    // Cari semua submission berdasarkan ID user yang login
    const history = await Submission.find({ userId: session.user.id })
      .populate('testId', 'title') // Ambil judul tes dari model 'Test'
      .sort({ testFinishTime: -1 }); // Urutkan dari yang terbaru

    return NextResponse.json({ success: true, history });
  } catch (error) {
    console.error("Submission History API Error:", error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil riwayat tes.' }, { status: 500 });
  }
}