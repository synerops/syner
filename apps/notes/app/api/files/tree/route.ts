import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { Octokit } from "@octokit/rest";

interface TreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: TreeNode[];
}

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.repo) {
    return NextResponse.json({ error: "No repository selected" }, { status: 400 });
  }

  const octokit = new Octokit({ auth: session.accessToken });

  try {
    // Get the repository's default branch
    const { data: repo } = await octokit.repos.get({
      owner: session.repo.owner,
      repo: session.repo.name,
    });

    // Get the tree recursively
    const { data: tree } = await octokit.git.getTree({
      owner: session.repo.owner,
      repo: session.repo.name,
      tree_sha: repo.default_branch,
      recursive: "true",
    });

    // Filter to only markdown files and build tree structure
    const mdFiles = tree.tree.filter(
      (item) => item.type === "blob" && item.path?.endsWith(".md")
    );

    // Build hierarchical tree
    const root: TreeNode = {
      name: session.repo.name,
      path: "",
      type: "directory",
      children: [],
    };

    for (const file of mdFiles) {
      if (!file.path) continue;

      const parts = file.path.split("/");
      let current = root;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;
        const path = parts.slice(0, i + 1).join("/");

        if (isFile) {
          current.children = current.children || [];
          current.children.push({
            name: part,
            path,
            type: "file",
          });
        } else {
          current.children = current.children || [];
          let dir = current.children.find(
            (c) => c.name === part && c.type === "directory"
          );
          if (!dir) {
            dir = {
              name: part,
              path,
              type: "directory",
              children: [],
            };
            current.children.push(dir);
          }
          current = dir;
        }
      }
    }

    return NextResponse.json(root);
  } catch (error) {
    console.error("Error fetching tree:", error);
    return NextResponse.json(
      { error: "Failed to fetch file tree" },
      { status: 500 }
    );
  }
}
