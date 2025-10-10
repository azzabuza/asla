import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { uid } = await req.json();
    if (!uid) {
      throw new Error("User ID (uid) diperlukan.");
    }

    // Client ini memiliki hak akses admin dan aman digunakan di server
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Hapus pengguna dari Supabase Authentication
    //    Ini harus dilakukan pertama kali
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(uid);
    if (authError) {
      // Jika pengguna sudah tidak ada di auth, kita bisa mengabaikan error ini
      // dan tetap melanjutkan menghapus dari tabel 'users'
      if (authError.message !== 'User not found') {
          throw authError;
      }
    }

    // 2. Hapus profil pengguna dari tabel 'users'
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', uid);
    if (dbError) {
      throw dbError;
    }

    return new Response(JSON.stringify({ message: `Pengguna ${uid} telah dihapus sepenuhnya.` }), {
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
