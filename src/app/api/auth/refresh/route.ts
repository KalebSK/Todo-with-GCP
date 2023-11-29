import { UserRefreshClient } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token");
        if (token) {
            const user = new UserRefreshClient(
                process.env.NEXT_PUBLIC_CLIENT_ID,
                process.env.CLIENT_SECRET,
                token.value
            );
            const tokens = await user.getRequestHeaders();
            const res = new NextResponse("access token refreshed", {
                status: 200,
                headers: tokens,
            });
            return res;
        }
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 500 });
    }
}
