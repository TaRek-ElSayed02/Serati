import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
          });

          const data = await res.json();

          if (res.ok && data) {
            if (data.token) {
              return {
                id: data.id || data._id || data.user?.id,
                email: data.email || data.user?.email,
                name: data.name || data.username || data.user?.username,
                firstName: data.firstName || data.firstname || data.user?.firstname,
                lastName: data.lastName || data.lastname || data.user?.lastname,
                token: data.token,
              };
            }

            return {
              id: data.id || data._id || data.user?.id,
              email: data.email || data.user?.email,
              name: data.name || data.username || data.user?.username,
              firstName: data.firstName || data.firstname || data.user?.firstname,
              lastName: data.lastName || data.lastname || data.user?.lastname,
              token: data.token,
              ...data
            }
          }
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      session.user = token.user
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  }
})