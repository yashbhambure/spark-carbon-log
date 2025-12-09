import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting daily reset job...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    console.log(`Archiving activities for date: ${yesterdayStr}`);

    // Get all users who had activities yesterday
    const { data: yesterdayActivities, error: fetchError } = await supabase
      .from('activities')
      .select('user_id, emission_kg')
      .eq('activity_date', yesterdayStr);

    if (fetchError) {
      console.error('Error fetching yesterday activities:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${yesterdayActivities?.length || 0} activities from yesterday`);

    // Group by user and calculate totals
    const userTotals: Record<string, { total: number; count: number }> = {};
    
    (yesterdayActivities || []).forEach(activity => {
      if (!userTotals[activity.user_id]) {
        userTotals[activity.user_id] = { total: 0, count: 0 };
      }
      userTotals[activity.user_id].total += Number(activity.emission_kg);
      userTotals[activity.user_id].count += 1;
    });

    // Insert or update daily history for each user
    for (const [userId, { total, count }] of Object.entries(userTotals)) {
      console.log(`Archiving for user ${userId}: ${total.toFixed(2)} kg from ${count} activities`);

      const { error: upsertError } = await supabase
        .from('daily_history')
        .upsert({
          user_id: userId,
          date: yesterdayStr,
          total_emission_kg: total,
          activity_count: count,
        }, {
          onConflict: 'user_id,date',
        });

      if (upsertError) {
        console.error(`Error upserting history for user ${userId}:`, upsertError);
      }
    }

    console.log('Daily reset completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Daily reset completed',
        usersProcessed: Object.keys(userTotals).length,
        date: yesterdayStr,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Daily reset error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
