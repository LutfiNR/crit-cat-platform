import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Pastikan terhubung ke database
        await dbConnect();

        // 2. Cari pengguna berdasarkan username yang diinput
        const user = await User.findOne({ username: credentials.username });
        if (!user) {
          // Jika user tidak ditemukan, tolak login
          throw new Error('Username atau password salah.');
        }

        // 3. Bandingkan password yang diinput dengan hash di database
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) {
          // Jika password tidak cocok, tolak login
          throw new Error('Username atau password salah.');
        }

        // 4. Jika semua benar, kembalikan data pengguna
        // Objek ini akan tersedia di callback JWT
        return {
          id: user._id,
          name: user.name,
          username: user.username,
          role: user.role,
          nis: user.nis,
          kelas: user.kelas,
          school: user.school
        };
      }
    })
  ],
  callbacks: {
    // Callback ini dipanggil saat token JWT dibuat (setelah login)
    jwt({ token, user }) {
      if (user) {
        // Tambahkan role dan id dari user ke dalam token
        token.id = user.id;
        token.role = user.role;
        token.nis = user.nis;
        token.kelas = user.kelas;
        token.school = user.school;
      }
      return token;
    },
    // Callback ini dipanggil saat sesi diakses oleh klien
    session({ session, token }) {
      if (session.user) {
        // Salin semua data dari 'token' ke 'session.user'
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.nis = token.nis;
        session.user.kelas = token.kelas;
        session.user.school = token.school;
      }
      return session;
    }
  },
  pages: {
    signIn: '/signin', // Jika pengguna perlu login, arahkan ke halaman ini
  },
  session: {
    strategy: 'jwt', // Gunakan JSON Web Tokens untuk manajemen sesi
    maxAge: 4 * 60 * 60, // 4 jam dalam detik
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };