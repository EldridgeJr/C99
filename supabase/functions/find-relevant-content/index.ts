import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestPayload {
  fileName?: string;
  fileType?: string;
  userId?: string;
  text?: string;
  filename?: string;
}

interface ContentRecommendation {
  courses: any[];
  podcasts: any[];
  videos: any[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { fileName, fileType, userId, text, filename }: RequestPayload = await req.json();

    console.log('Finding content for file:', fileName || filename);

    const recommendations: ContentRecommendation = {
      courses: [],
      podcasts: [],
      videos: [],
    };

    let categories = ["Before Court", "During Court", "Information & Organization"];

    if (text) {
      const textLower = text.toLowerCase();

      if (textLower.includes('payment') || textLower.includes('debt') || textLower.includes('money') || textLower.includes('owe')) {
        categories = ["Debt Collection", "Payment Order", ...categories];
      }
      if (textLower.includes('tenant') || textLower.includes('rent') || textLower.includes('lease') || textLower.includes('eviction')) {
        categories = ["Tenancy", "Housing", ...categories];
      }
      if (textLower.includes('contract') || textLower.includes('agreement') || textLower.includes('breach')) {
        categories = ["Contract Law", "Before Court", ...categories];
      }
      if (textLower.includes('divorce') || textLower.includes('custody') || textLower.includes('family')) {
        categories = ["Family Law", ...categories];
      }
      if (textLower.includes('criminal') || textLower.includes('offense') || textLower.includes('charge')) {
        categories = ["Criminal Law", ...categories];
      }
      if (textLower.includes('evidence') || textLower.includes('witness') || textLower.includes('testimony')) {
        categories = ["During Court", "Trial Preparation", ...categories];
      }
    }

    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("*")
      .in("category", categories.slice(0, 5))
      .limit(6);

    if (coursesError) {
      console.error('Courses error:', coursesError);
    }

    if (courses) {
      recommendations.courses = courses;
    }

    const { data: podcasts, error: podcastsError } = await supabase
      .from("podcasts")
      .select(`
        *,
        episodes:podcast_episodes(count)
      `)
      .limit(4);

    if (podcastsError) {
      console.error('Podcasts error:', podcastsError);
    }

    if (podcasts) {
      recommendations.podcasts = podcasts;
    }

    const { data: videos, error: videosError } = await supabase
      .from("content_items")
      .select("*")
      .eq("content_type", "video")
      .limit(4);

    if (videosError) {
      console.error('Videos error:', videosError);
    }

    if (videos) {
      recommendations.videos = videos;
    }

    console.log('Recommendations found:', {
      courses: recommendations.courses.length,
      podcasts: recommendations.podcasts.length,
      videos: recommendations.videos.length,
    });

    return new Response(JSON.stringify(recommendations), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error finding relevant content:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});