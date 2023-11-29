import { useGoogleLogin } from "@react-oauth/google";
import { apiUrls } from "./api";
import { TokenResponseData } from "@/app/api/auth/route";

async function getTokens(code: string) {
    const reqInit: RequestInit = {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
    };
    return await fetch(apiUrls.auth.init, reqInit);
}

export default function useGoogleTasks(
    syncCallback?: (tokens: TokenResponseData) => Promise<void>
) {
    const login = useGoogleLogin({
        onSuccess: async ({ code }) => {
            console.log(code);
            const resp = await getTokens(code);
            const body = await resp.json();
            if (!body.access_token) {
                console.error("error with google login: ", body);
            }
            if (syncCallback) {
                syncCallback(body);
            }
        },
        flow: "auth-code",
        onError: (errorResponse) => console.log(errorResponse),
        scope: "https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/tasks.readonly",
    });

    return login;
}
