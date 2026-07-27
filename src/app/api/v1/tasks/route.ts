import { NextResponse } from "next/server";
import { initialTasks } from "@/data/demo";
import { rateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const identifier = forwarded?.split(",")[0] ?? "anonymous";
  const limit = await rateLimit(identifier);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "false") {
    return NextResponse.json({
      data: initialTasks,
      meta: { mode: "demo", rateLimitRemaining: limit.remaining },
    });
  }

  const supabase = await createClient();
  const { data: claims, error: authError } = await supabase.auth.getClaims();
  if (authError || !claims?.claims?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .select(
      "id, task_number, title, status_id, priority, due_at, project:projects(id, name, color)",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    data,
    meta: { mode: "live", rateLimitRemaining: limit.remaining },
  });
}

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "false") {
    return NextResponse.json(
      { error: "Writes are disabled in demo mode." },
      { status: 403 },
    );
  }

  const supabase = await createClient();
  const { data: claims, error: authError } = await supabase.auth.getClaims();
  if (authError || !claims?.claims?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      project_id: body.projectId,
      title: body.title,
      description: body.description ?? null,
      priority: body.priority ?? "medium",
      status_id: body.statusId,
      created_by: claims.claims.sub,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
