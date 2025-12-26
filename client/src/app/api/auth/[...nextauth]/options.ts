import { JWT } from 'next-auth/jwt';
import axios from 'axios';
import Credentials from 'next-auth/providers/credentials';
import { LOGIN_URL } from '@/lib/apiEndPoints';
import { AuthOptions, ISODateString } from 'next-auth';

export type CustomSession = {
  user?: CustomUser;
  expires: ISODateString;
};

export type CustomUser = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  token?: string | null;
};

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 365 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          token: user.token,
        };
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: CustomSession;
      token: JWT;
    }) {
      if (token.user) {
        session.user = token.user as CustomUser;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: 'Welcome Back',
      type: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password required');
          }

          const { data } = await axios.post(LOGIN_URL, {
            email: credentials.email,
            password: credentials.password,
          });

          const user = data?.data;
          if (user) {
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              token: user.token,
            };
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
};