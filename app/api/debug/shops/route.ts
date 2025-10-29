import { createClient } from "@/lib/supabase/server";
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("shops_tables").select();
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return Response.json({
      message: "No Shops Found under this user",
      data: [],
    });
  }
  return Response.json(data);
}
