import { getServerSession, type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { JWT } from "next-auth/jwt"
import type { User } from "next-auth"

// NextAuthのシークレットキーをログに出力（開発時のデバッグ用）
console.log("NextAuth Secret:", process.env.NEXTAUTH_SECRET);

// NextAuthのSessionインターフェースを拡張
declare module "next-auth" {
  interface Session {
    accessToken?: string  // JWTアクセストークンを保存するためのプロパティ
    user: UserType  // カスタムユーザー型を使用
  }
  interface User {
    access: string
    refresh: string
    uid: string
    name: string
    email: string
    avatar?: string
    introduction: string
  }
}

// NextAuthのJWTインターフェースを拡張
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string  // JWTアクセストークン
    refreshToken?: string  // JWTリフレッシュトークン
    user: UserType  // カスタムユーザー型を使用
  }
}

// アプリケーション固有のユーザー型定義
export interface UserType {
  uid: string
  name: string
  email: string
  avatar?: string | undefined
  introduction: string
}

// APIリクエストを行う共通関数
const fetchAPI = async (url: string, options: RequestInit) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log('API URL:', apiUrl);  // APIのURLをログ出力（デバッグ用）

  if (!apiUrl) {
    throw new Error("API URLが設定されていません")
  }

  const response = await fetch(`${apiUrl}${url}`, options)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("API Error:", response.status, errorData);
    throw new Error(`APIでエラーが発生しました: ${response.status}`)
  }

  return response.json()
}

// JWTアクセストークンの有効性を検証する関数
const verifyAccessToken = async (token: string) => {
  try {
    const response = await fetchAPI("/api/auth/jwt/verify/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    console.log("Token verification response:", response);
    return true;  // トークンが有効
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;  // トークンが無効
  }
}

// JWTアクセストークンを更新する関数
const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  try {
    const { access } = await fetchAPI("/api/auth/jwt/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: token.refreshToken }),
    })
    console.log("Token refreshed successfully");
    return {
      ...token,
      accessToken: access,
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

// ユーザー認証とユーザー情報取得を行う関数
const authorizeUser = async (email: string, password: string): Promise<User> => {
  console.log("Authorizing user:", email);
  // JWTトークンを取得
  const auth = await fetchAPI("/api/auth/jwt/create/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  console.log("Auth response:", auth);
  // ここでJWTが正しく返ってくるか確認
  if (auth.access) {
    console.log("Access token obtained:", auth.access);
  } else {
    console.error("Failed to obtain access token");
  }

  // 取得したトークンを使用してユーザー情報を取得
  const userData = await fetchAPI("/api/auth/users/me/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.access}`,
    },
  })

  console.log("User data:", userData);

  // ユーザー情報とトークンを合わせて返す
  return {
    ...userData,
    access: auth.access,
    refresh: auth.refresh,
  }
}

// NextAuthの設定オプション
export const authOptions: NextAuthOptions = {
  providers: [
    // クレデンシャルプロバイダーの設定
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("メールアドレスとパスワードを入力してください");
        }

        try {
          // ユーザー認証を行い、ユーザー情報を返す
          return await authorizeUser(credentials.email, credentials.password);
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",  // JWTを使用してセッションを管理
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // JWTトークンの生成・更新時に呼ばれるコールバック
    async jwt({ token, user, account }) {
      console.log("JWT Callback - Token:", token, "User:", user);

      if (user) {
        // 初回ログイン時にユーザー情報をトークンに保存
        token.accessToken = user.access;
        token.refreshToken = user.refresh;
        token.user = {
          uid: user.uid,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          introduction: user.introduction,
        };
        console.log("Tokens saved:", token);
      } else if (token.accessToken) {
        console.log("Token already present:", token.accessToken);
        // トークンの有効性を確認し、必要に応じて更新
        if (!(await verifyAccessToken(token.accessToken))) {
          console.log("Access token invalid, attempting refresh");
          return refreshAccessToken(token);
        }
      }

      return token;
    },
    // セッション取得時に呼ばれるコールバック
    async session({ session, token }) {
      console.log("Session Callback - Session:", session, "Token:", token);
      // JWTトークンの情報をセッションに反映
      session.accessToken = token.accessToken;
      session.user = token.user;
      console.log("Updated session:", session);
      return session;
    },
  },
  pages: {
    signIn: '/login',  // カスタムログインページのパス
  },
}

// サーバーサイドで認証済みセッションを取得する関数
export const getAuthSession = async () => {
  const session = await getServerSession(authOptions)

  if (!session || !session.accessToken) {
    return null
  }

  return session.user as UserType
}

