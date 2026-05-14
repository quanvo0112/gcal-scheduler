import NextAuth, { type NextAuthOptions, type Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.events",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;

        // Google may only return refresh_token on first consent or when forcing consent.
        if (account.refresh_token) {
          token.refreshToken = account.refresh_token;
        }
      }

      return token;
    },
    async session({ session, token }) {
      const extendedSession = session as Session & {
        accessToken?: string;
        refreshToken?: string;
      };

      extendedSession.accessToken = token.accessToken as string | undefined;
      extendedSession.refreshToken = token.refreshToken as string | undefined;

      return extendedSession;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
