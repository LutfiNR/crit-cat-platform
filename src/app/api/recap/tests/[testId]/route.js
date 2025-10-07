// /src/app/api/recap/tests/[testId]/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Submission from '@/models/Submission';
import Test from '@/models/Test';

export async function GET(request, { params }) {
  const { testId } = params;
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'guru') {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  try {
    // --- Keamanan Berlapis ---
    // 1. Cek apakah tesnya ada
    const test = await Test.findById(testId);
    if (!test) {
      return NextResponse.json({ message: "Tes tidak ditemukan" }, { status: 404 });
    }
    // 2. Cek apakah guru ini pemilik tes tersebut
    if (test.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ message: "Anda tidak memiliki akses ke rekap tes ini" }, { status: 403 });
    }
    // -------------------------

    // Cari semua submission yang cocok dengan testId
    const submissions = await Submission.find({ testId: testId })
      .select('userInfo finalTheta testFinishTime createdAt') // Hanya ambil field yang perlu
      .sort({ createdAt: -1 });

    // Gabungkan data tes dan data submissions untuk dikirim ke frontend
    const recapData = {
      test: {
        _id: test._id,
        title: test.title,
        accessCode: test.accessCode,
      },
      submissions: submissions,
    };

    return NextResponse.json({ success: true, data: recapData });
  } catch (error) {
    console.error("Recap Detail API Error:", error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil data detail rekap.' }, { status: 500 });
  }
}