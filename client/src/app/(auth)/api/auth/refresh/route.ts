import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, API_ENDPOINTS } from "@/utils/constants";
import { RefreshTokenResponse } from "@/types/api";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get cookies from the request
    const cookieHeader = request.headers.get("cookie");

    // Forward the refresh request to your backend
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REFRESH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader || "",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to refresh token" },
        { status: response.status }
      );
    }

    const data: RefreshTokenResponse = await response.json();

    // Forward any set-cookie headers from the backend
    const setCookieHeader = response.headers.get("set-cookie");
    const nextResponse = NextResponse.json(data);

    // const setCookieHeaders = response.headers.getSetCookie?.() ?? [];
    // setCookieHeaders.forEach((cookie) => {
    //   nextResponse.headers.append("set-cookie", cookie);
    // });

    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
