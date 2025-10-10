// supabase/functions/create-user/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Tangani preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, password, name, role, nik, gender, employeeStatus } = await req.json();
    
    // Validasi input
    if (!email || !password || !name || !role) {
        throw new Error("Email, password, name, and role are required.");
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Buat user di sistem Autentikasi Supabase
    const { data: { user }, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Langsung konfirmasi email
    });

    if (authError) {
      throw authError;
    }
    if (!user) {
        throw new Error("Failed to create user in authentication system.");
    }

    // Masukkan data profil ke tabel 'users'
    const { data: profileData, error: dbError } = await supabaseAdmin
      .from('users')
      .insert({
        id: user.id,
        email: email,
        name: name,
        role: role,
        nik: nik,
        gender: gender,
        employee_status: employeeStatus,
        online: false
      })
      .select()
      .single(); // Tambahkan .select().single() untuk mengembalikan data yang baru dibuat

    if (dbError) {
      // Jika gagal memasukkan ke tabel, hapus user yang sudah terbuat di auth
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      throw dbError;
    }

    // Kirim kembali data profil lengkap
    return new Response(JSON.stringify(profileData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
