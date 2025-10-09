// supabase-client.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Ganti dengan URL dan Anon Key dari proyek Supabase Anda
const supabaseUrl = 'https://vvetirdhwmnqjiivqyrd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2ZXRpcmRod21ucWppaXZxeXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MDUyODgsImV4cCI6MjA3NTM4MTI4OH0.hCIJClUUZKiCZo1WmefQKLFAYOJYr-2wOP9vgVdEtkY';

// Inisialisasi dan ekspor client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
