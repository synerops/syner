import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      new URL(`/edit?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  // Validate state
  const storedState = request.cookies.get("oauth_state")?.value;
  if (!state || state !== storedState) {
    return NextResponse.redirect(
      new URL("/edit?error=invalid_state", request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/edit?error=missing_code", request.url)
    );
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.redirect(
      new URL("/edit?error=oauth_not_configured", request.url)
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.redirect(
        new URL(`/edit?error=${encodeURIComponent(tokenData.error)}`, request.url)
      );
    }

    const accessToken = tokenData.access_token;

    // Get user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    const user = await userResponse.json();

    // Get installations (to find synerbot installation)
    const installationsResponse = await fetch(
      "https://api.github.com/user/installations",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    const installationsData = await installationsResponse.json();

    // Find synerbot installation or use first one
    const installation = installationsData.installations?.find(
      (i: { app_slug?: string }) => i.app_slug === "synerbot"
    ) || installationsData.installations?.[0];

    // Create session
    await createSession({
      user: {
        id: user.id,
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
      },
      installationId: installation?.id || 0,
      accessToken,
    });

    // Clear OAuth state cookie and redirect
    const response = NextResponse.redirect(new URL("/edit", request.url));
    response.cookies.delete("oauth_state");
    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/edit?error=oauth_failed", request.url)
    );
  }
}
