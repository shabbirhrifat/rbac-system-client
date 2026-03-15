import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE_NAME, getApiBaseUrl, REFRESH_COOKIE_NAME } from "@/lib/config";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;
  const headers = new Headers();

  if (accessToken) {
    headers.set("authorization", `Bearer ${accessToken}`);
  }

  if (refreshToken) {
    headers.set("cookie", `${REFRESH_COOKIE_NAME}=${refreshToken}`);
  }

  const response = await fetch(`${getApiBaseUrl()}/reports/export`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: "Unable to export reports." },
      { status: response.status },
    );
  }

  const csv = await response.text();

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="reports-overview.csv"',
    },
  });
}
