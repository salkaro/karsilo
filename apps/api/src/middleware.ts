import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
    "https://karsilo.com",
    "https://www.karsilo.com",
    "http://localhost:3000",
    "http://localhost:3001",
];

function getCorsHeaders(origin: string | null) {
    const headers: Record<string, string> = {
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
            "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age": "86400",
    };

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        headers["Access-Control-Allow-Origin"] = origin;
    }

    return headers;
}

export function middleware(request: NextRequest) {
    const origin = request.headers.get("origin");
    const corsHeaders = getCorsHeaders(origin);

    if (request.method === "OPTIONS") {
        return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    const response = NextResponse.next();
    for (const [key, value] of Object.entries(corsHeaders)) {
        response.headers.set(key, value);
    }
    return response;
}

export const config = {
    matcher: ["/health", "/v1/:path*", "/playground/:path*"],
};