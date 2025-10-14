// /src/app/api/attempt/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Question from '@/models/Question';
import Test from '@/models/Test';
import Submission from '@/models/Submission';

// Endpoint ini akan dipanggil saat siswa memasukkan kode akses
export async function POST(request) {
    const session = await getServerSession(authOptions);
    // Keamanan: Hanya siswa yang login yang boleh mencoba memulai tes
    if (session?.user?.role !== 'siswa') {
        return NextResponse.json({ message: "Akses ditolak. Hanya untuk siswa." }, { status: 403 });
    }

    await dbConnect();
    try {
        const { accessCode } = await request.json();

        if (!accessCode) {
            return NextResponse.json({ message: 'Kode akses diperlukan.' }, { status: 400 });
        }

        // Cari tes berdasarkan kode akses
        const test = await Test.findOne({ accessCode })
            .populate('questions'); // <-- Ambil semua data soal terkait

        if (!test) {
            return NextResponse.json({ message: 'Tes dengan kode akses tersebut tidak ditemukan.' }, { status: 404 });
        }

        // Cek apakah tes sudah dipublikasikan oleh guru
        if (test.status !== 'published') {
            return NextResponse.json({ message: 'Tes ini belum dipublikasikan oleh guru.' }, { status: 403 });
        }

        // Jika semua valid, kirim kembali data tes (termasuk semua soalnya)
        return NextResponse.json({ success: true, testData: test });

    } catch (error) {
        console.error("Attempt API Error:", error);
        return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
    }
}