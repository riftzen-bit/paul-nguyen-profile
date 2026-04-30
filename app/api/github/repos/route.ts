import { NextResponse } from "next/server";
import { getGitHubProfile, getGitHubRepos } from "../../../projects/github";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [profile, repos] = await Promise.all([
      getGitHubProfile("live"),
      getGitHubRepos("live")
    ]);

    return NextResponse.json(
      { profile, repos, fetchedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "GitHub API unavailable";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
