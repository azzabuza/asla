// Impor library yang dibutuhkan dari Deno dan Supabase
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Definisikan CORS Headers untuk mengizinkan permintaan dari browser Anda
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Fungsi 'create-user' siap menerima permintaan.");

serve(async (req) => {
  // Tangani permintaan preflight CORS yang dikirim oleh browser
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Ambil data pengguna baru dari body permintaan yang dikirim dari form
    const { email, password, name, role, nik, gender, employeeStatus } = await req.json();

    // Buat "Admin Client" Supabase. Client ini menggunakan kunci SERVICE_ROLE
    // yang memberinya hak akses penuh untuk melakukan operasi admin.
    // Kunci ini aman karena kode ini berjalan di server Supabase, bukan di browser.
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Langkah 1: Buat pengguna baru di sistem otentikasi Supabase (Auth)
    console.log(`Mencoba membuat pengguna auth untuk: ${email}`);
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Langsung aktifkan akun tanpa perlu verifikasi email
    });

    if (authError) {
      console.error("Error saat membuat pengguna auth:", authError.message);
      throw authError;
    }

    const userId = authData.user.id;
    console.log(`Pengguna auth berhasil dibuat dengan ID: ${userId}`);

    // Langkah 2: Masukkan profil pengguna ke dalam tabel 'public.users' di database
    console.log(`Mencoba memasukkan profil untuk ID: ${userId}`);
    const { error: profileError } = await supabaseAdmin.from('users').insert({
      id: userId,
      name: name,
      role: role,
      nik: nik,
      gender: gender,
      employee_status: employeeStatus,
      locked: false,
      online: false
    });

    if (profileError) {
      console.error("Error saat memasukkan profil pengguna:", profileError.message);
      // PENTING: Jika gagal membuat profil, hapus akun auth yang sudah terlanjur dibuat
      // agar tidak ada akun "hantu" di sistem otentikasi.
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw profileError;
    }

    console.log(`Profil untuk ${name} berhasil dimasukkan.`);

    // Jika semua berhasil, kirim respons sukses kembali ke browser
    return new Response(JSON.stringify({ message: `Pengguna ${name} berhasil dibuat` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    // Jika ada error di langkah mana pun, kirim respons error
    console.error("Terjadi error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
