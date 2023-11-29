import { OAuth2Client } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";
import { Client, createClient } from "@libsql/client";

export interface TokenResponseData {
    access_token: string;
    expiry_date: number;
    id_token: string;
    scope: string;
    token_type: string;
}

export const oAuth2Client = new OAuth2Client(
    process.env.NEXT_PUBLIC_CLIENT_ID,
    process.env.CLIENT_SECRET,
    "postmessage"
);

let db: null | Client = null;

export async function POST(req: NextRequest) {
    console.log(__dirname);
    if (!db) {
        db = createClient({
            url: process.env.DB_URL!,
            authToken: process.env.DB_KEY!,
        });
    }

    try {
        const body = await req.json();
        if (body.code) {
            console.log(body.code);
            const { tokens } = await oAuth2Client.getToken(body.code);
            console.log(tokens);

            if (!tokens.refresh_token) {
                return new NextResponse("error getting token!", {
                    status: 500,
                });
            }

            const tokenRes: TokenResponseData = {
                access_token: tokens.access_token!,
                expiry_date: tokens.expiry_date!,
                id_token: tokens.id_token!,
                scope: tokens.scope!,
                token_type: tokens.token_type!,
            };

            const user = await oAuth2Client.getTokenInfo(tokenRes.access_token);

            const updateUser = await db.execute({
                sql: "INSERT INTO users(email, refreshToken) VALUES (@email, @refreshToken) ON CONFLICT(email) DO UPDATE SET refreshToken=excluded.refreshToken",
                args: {
                    email: user.email!,
                    refreshToken: tokens.refresh_token!,
                },
            });

            console.log(updateUser);

            const res = new NextResponse(JSON.stringify(tokenRes), {
                status: 200,
            });

            res.cookies.set("token", tokens.refresh_token, {
                httpOnly: true,
                sameSite: true,
                secure: true,
            });
            return res;
        }
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify(error), { status: 500 });
    }
}
