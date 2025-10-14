// /src/app/api/recap/tests/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Question from '@/models/Question';
import Test from '@/models/Test';
import Submission from '@/models/Submission';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'guru') {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
  }

  await dbConnect();
  try {
    // Kita gunakan Aggregation Pipeline untuk menggabungkan data Test dan Submission
    const testsWithSubmissionCount = await Test.aggregate([
      // 1. Cari hanya tes yang dibuat oleh guru yang sedang login
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(session.user.id)
        }
      },
      // 2. Gabungkan (lookup) dengan collection 'submissions'
      {
        $lookup: {
          from: 'submissions', // nama collection di MongoDB
          localField: '_id',
          foreignField: 'testId',
          as: 'submissions' // simpan hasil gabungan sebagai array 'submissions'
        }
      },
      // 3. Tambahkan field baru 'submissionCount' yang berisi jumlah item di array 'submissions'
      {
        $addFields: {
          submissionCount: { $size: '$submissions' }
        }
      },
      // 4. Pilih field mana saja yang mau ditampilkan (buang array 'submissions' yang besar)
      {
        $project: {
          title: 1,
          accessCode: 1,
          status: 1,
          createdAt: 1,
          submissionCount: 1,
        }
      },
      // 5. Urutkan dari yang terbaru
      {
        $sort: {
          createdAt: -1
        }
      }
    ]);

    return NextResponse.json({ success: true, data: testsWithSubmissionCount });
  } catch (error) {
    console.error("Recap API Error:", error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil data rekap.' }, { status: 500 });
  }
}