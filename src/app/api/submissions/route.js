// /src/app/api/submissions/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Question from '@/models/Question';
import Test from '@/models/Test';
import Submission from '@/models/Submission';

export async function POST(request) {
  // 1. Ambil sesi untuk verifikasi dan keamanan
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Tidak terautentikasi" }, { status: 401 });
  }

  // 2. Hubungkan ke database
  await dbConnect();

  try {
    // 3. Ambil data submission dari body request
    const submissionData = await request.json();

    // 4. Validasi keamanan tambahan: pastikan data yang dikirim adalah milik pengguna yang login
    if (submissionData.userId !== session.user.id) {
        return NextResponse.json({ message: "Data pengguna tidak cocok" }, { status: 403 });
    }

    // 5. Buat dokumen baru menggunakan Model Submission
    const newSubmission = new Submission(submissionData);
    
    // 6. Simpan ke database
    await newSubmission.save();

    // 7. Kirim kembali respons sukses
    return NextResponse.json(
      { success: true, message: 'Hasil tes berhasil disimpan.', submissionId: newSubmission._id },
      { status: 201 } // 201 Created
    );

  } catch (error) {
    // Tangani error jika data tidak sesuai skema Mongoose atau error lainnya
    console.error('Error saving submission:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ success: false, message: 'Data submission tidak valid.', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Gagal menyimpan hasil tes.' }, { status: 500 });
  }
}