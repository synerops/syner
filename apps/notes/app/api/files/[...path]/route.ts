import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { Octokit } from "@octokit/rest";

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

// GET - Read file contents
export async function GET(request: NextRequest, context: RouteContext) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.repo) {
    return NextResponse.json({ error: "No repository selected" }, { status: 400 });
  }

  const { path } = await context.params;
  const filePath = path.join("/");

  const octokit = new Octokit({ auth: session.accessToken });

  try {
    const { data } = await octokit.repos.getContent({
      owner: session.repo.owner,
      repo: session.repo.name,
      path: filePath,
    });

    if (Array.isArray(data)) {
      return NextResponse.json({ error: "Path is a directory" }, { status: 400 });
    }

    if (data.type !== "file") {
      return NextResponse.json({ error: "Not a file" }, { status: 400 });
    }

    const content = Buffer.from(data.content, "base64").toString("utf-8");

    return NextResponse.json({
      path: data.path,
      content,
      sha: data.sha,
      name: data.name,
    });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "status" in error && error.status === 404) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    console.error("Error reading file:", error);
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}

// PUT - Update file
export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.repo) {
    return NextResponse.json({ error: "No repository selected" }, { status: 400 });
  }

  const { path } = await context.params;
  const filePath = path.join("/");

  try {
    const body = await request.json();
    const { content, message, sha } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    if (!sha) {
      return NextResponse.json({ error: "SHA is required for updates" }, { status: 400 });
    }

    const octokit = new Octokit({ auth: session.accessToken });

    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner: session.repo.owner,
      repo: session.repo.name,
      path: filePath,
      message: message || `Update ${filePath}`,
      content: Buffer.from(content).toString("base64"),
      sha,
    });

    return NextResponse.json({
      path: data.content?.path,
      sha: data.content?.sha,
      commit: data.commit.sha,
    });
  } catch (error) {
    console.error("Error updating file:", error);
    return NextResponse.json({ error: "Failed to update file" }, { status: 500 });
  }
}

// POST - Create file
export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.repo) {
    return NextResponse.json({ error: "No repository selected" }, { status: 400 });
  }

  const { path } = await context.params;
  const filePath = path.join("/");

  try {
    const body = await request.json();
    const { content, message } = body;

    const octokit = new Octokit({ auth: session.accessToken });

    // Check if file already exists
    try {
      await octokit.repos.getContent({
        owner: session.repo.owner,
        repo: session.repo.name,
        path: filePath,
      });
      return NextResponse.json(
        { error: "File already exists. Use PUT to update." },
        { status: 409 }
      );
    } catch (error: unknown) {
      // 404 is expected - file doesn't exist yet
      if (!error || typeof error !== "object" || !("status" in error) || error.status !== 404) {
        throw error;
      }
    }

    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner: session.repo.owner,
      repo: session.repo.name,
      path: filePath,
      message: message || `Create ${filePath}`,
      content: Buffer.from(content || "").toString("base64"),
    });

    return NextResponse.json({
      path: data.content?.path,
      sha: data.content?.sha,
      commit: data.commit.sha,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating file:", error);
    return NextResponse.json({ error: "Failed to create file" }, { status: 500 });
  }
}

// DELETE - Delete file
export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.repo) {
    return NextResponse.json({ error: "No repository selected" }, { status: 400 });
  }

  const { path } = await context.params;
  const filePath = path.join("/");

  try {
    const body = await request.json();
    const { sha, message } = body;

    if (!sha) {
      return NextResponse.json({ error: "SHA is required for deletion" }, { status: 400 });
    }

    const octokit = new Octokit({ auth: session.accessToken });

    await octokit.repos.deleteFile({
      owner: session.repo.owner,
      repo: session.repo.name,
      path: filePath,
      message: message || `Delete ${filePath}`,
      sha,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
