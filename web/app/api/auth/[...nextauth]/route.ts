import { verifyToken } from "@/lib/utils/auth"
import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { env } from "process"

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID!,
            clientSecret: env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    callbacks: {
        async signIn({account, user}) {
            if (account?.provider == "google" && account.id_token) {
                try {
                    account.backend_token = await verifyToken(account.id_token)
                    return true
                } catch (error) {
                    console.error(error)
                }
            }
            return false
        },
        async jwt({token, account}) {
            if (account?.backend_token) {
                token.accessToken = account.backend_token;
            }
            return token;
        },
        async session({session, token}: any) {
            session.accessToken = token.accessToken;
            return session;
        }
    },
    pages: {
        signIn: "/login"
    }
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}