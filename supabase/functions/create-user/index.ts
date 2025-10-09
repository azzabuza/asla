// Lokasi file: supabase/functions/delete-group/index.ts

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
    const { groupId } = await req.json();
    if (!groupId) {
      throw new Error("Group ID is required");
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Hapus semua pesan yang terkait dengan grup ini
    const { error: deleteMessagesError } = await supabaseAdmin
      .from('messages')
      .delete()
      .eq('chat_id', groupId);

    if (deleteMessagesError) {
      throw deleteMessagesError;
    }

    // Hapus grup itu sendiri
    const { error: deleteGroupError } = await supabaseAdmin
      .from('groups')
      .delete()
      .eq('id', groupId);

    if (deleteGroupError) {
      throw deleteGroupError;
    }

    return new Response(JSON.stringify({ message: `Group ${groupId} and its messages have been deleted.` }), {
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
