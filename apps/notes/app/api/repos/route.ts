import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "@/lib/session";
import { Octokit } from "@octokit/rest";

// GET - List user's repos
export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const octokit = new Octokit({ auth: session.accessToken });

  try {
    const { data } = await octokit.repos.listForAuthenticatedUser({
      sort: "updated",
      per_page: 50,
    });

    const repos = data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      owner: repo.owner.login,
      private: repo.private,
      description: repo.description,
    }));

    return NextResponse.json({
      repos,
      selected: session.repo,
    });
  } catch (error) {
    console.error("Error listing repos:", error);
    return NextResponse.json(
      { error: "Failed to list repositories" },
      { status: 500 }
    );
  }
}

// POST - Select or create a repo
export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { owner, name, create } = body;

    const octokit = new Octokit({ auth: session.accessToken });

    if (create) {
      // Create a new repo
      const { data } = await octokit.repos.createForAuthenticatedUser({
        name: name || "kb",
        description: "My knowledge base powered by syner.md",
        private: true,
        auto_init: true, // Create with README
      });

      await updateSession({
        repo: {
          owner: data.owner.login,
          name: data.name,
        },
      });

      return NextResponse.json({
        repo: {
          owner: data.owner.login,
          name: data.name,
        },
        created: true,
      }, { status: 201 });
    } else {
      // Select existing repo
      if (!owner || !name) {
        return NextResponse.json(
          { error: "Owner and name are required" },
          { status: 400 }
        );
      }

      // Verify the repo exists and user has access
      try {
        await octokit.repos.get({ owner, repo: name });
      } catch {
        return NextResponse.json(
          { error: "Repository not found or no access" },
          { status: 404 }
        );
      }

      await updateSession({
        repo: { owner, name },
      });

      return NextResponse.json({
        repo: { owner, name },
      });
    }
  } catch (error) {
    console.error("Error selecting repo:", error);
    return NextResponse.json(
      { error: "Failed to select repository" },
      { status: 500 }
    );
  }
}
