import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(
  'https://rizqrfvanoxhdypdyoge.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpenFyZnZhbm94aGR5cGR5b2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NDM4MzQsImV4cCI6MjEwMzExOTgzNH0.182-Fxc0ZHKm94C38Z7PZn96Yc7mZ_VL_53Qr3sSXdA'
);

const file = readFileSync('public/Foto M. Nabhan Dhiyauz Zaman.jpg');

const { error } = await supabase.storage
  .from('portfolio-assets')
  .upload('profile/foto-nabhan.jpg', file, { contentType: 'image/jpeg', upsert: true });

if (error) { console.error('ERROR:', error.message); process.exit(1); }

const { data: { publicUrl } } = supabase.storage
  .from('portfolio-assets')
  .getPublicUrl('profile/foto-nabhan.jpg');

console.log('SUCCESS:', publicUrl);
