// /src/lib/dbConnect.js

import mongoose from 'mongoose';

// Ambil URI dari environment variable
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Harap definisikan MONGODB_URI di dalam file .env.local');
}

/**
 * Koneksi global digunakan di sini untuk mempertahankan koneksi yang di-cache
 * di antara hot reloads dalam mode development. Ini mencegah koneksi
 * bertambah secara eksponensial selama penggunaan API Route.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    // Gunakan koneksi yang sudah ada dari cache
    return cached.conn;
  }

  if (!cached.promise) {
    // Jika tidak ada koneksi di cache, buat koneksi baru
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;