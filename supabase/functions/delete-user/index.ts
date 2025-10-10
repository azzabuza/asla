// supabase/functions/delete-user/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Tangani preflight request (penting untuk CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { uid } = await req.json();
    if (!uid) {
      throw new Error("User ID (uid) is required.");
    }

    // Buat admin client untuk bisa menghapus user
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Hapus user dari sistem autentikasi
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(uid);
    if (authError) {
      // Jika user sudah tidak ada di auth, anggap berhasil dan lanjutkan
      if (authError.message !== "User not found") {
        throw authError;
      }
    }
    
    // Hapus data user dari tabel public.users
    const { error: dbError } = await supabaseAdmin.from('users').delete().eq('id', uid);
    if (dbError) {
      console.warn(`Warning: Could not delete user from public.users table:`, dbError.message);
    }

    return new Response(JSON.stringify({ message: `User ${uid} deleted successfully.` }), {
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
