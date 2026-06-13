import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cxvskcqlpicgrfawdmii.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_oHDa2QrICWCATGFX6HSaug__AKH6XTI'

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function fetchTeamMembers() {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return data
}
