import Todos from "./Todos";
import GoogleOAuthProvider from "./googleoauthprovider";
export default function Home() {
    return (
        <main className="h-screen bg-gradient-to-b text-3xl from-slate-900 to-slate-800 flex justify-center">
            <div className="flex flex-col gap-2">
                <div className="h-10 w-full"></div>
                <h1 className="text-blue-200 gap-4 text-center">
                    Welcome To
                    <span className="bg-gradient-to-b inline-block from-blue-400 text-4xl to-blue-200 bg-clip-text text-transparent">
                        Todo
                    </span>
                </h1>
                <GoogleOAuthProvider
                    clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}
                >
                    <Todos></Todos>
                </GoogleOAuthProvider>
            </div>
        </main>
    );
}
