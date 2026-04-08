import { refreshToken, verifyToken } from "@/lib/utils/auth"
import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { env } from "process"

async function get_refresh_token(refresh_token:string) {
    try {
        const res = await refreshToken(refresh_token)
        return res
    } catch (error) {
        throw error
    }
}

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
                    const verified_token = await verifyToken(account.id_token)
                    account.backend_token = verified_token.access_token
                    account.refreshToken = verified_token.refresh_token
                    return true
                } catch (error) {
                    console.error(error)
                }
            }
            return false
        },
        async jwt({token, account}) {
            if (account?.backend_token) {
                token.accessToken = account.backend_token
                token.refreshToken = account.refreshToken
                token.expiresAt = Math.floor(Date.now() / 1000) + 30 * 60
            }

            if (Date.now() < (token.expiresAt as number) * 1000 - 60000) {
                return token
            }

            try {
                const refreshed_token = await get_refresh_token(token.refreshToken as string)
                token.accessToken = refreshed_token.access_token
                token.refreshToken = refreshed_token.refresh_token
                token.expiresAt = Math.floor(Date.now() / 1000) + 30 * 60

                return token;
            } catch (error) {
                token.error = "RefreshAccessTokenError"
                return token;
            }
        },
        async session({session, token}: any) {
            session.accessToken = token.accessToken
            session.refreshToken = token.refreshToken
            session.error = token.error
            return session
        }
    },
    pages: {
        signIn: "/login"
    }
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}