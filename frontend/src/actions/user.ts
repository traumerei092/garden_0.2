"use server"

import { z } from "zod"
import {signOut} from "next-auth/react";
import {getServerSession} from "next-auth";
import {authOptions} from "../../lib/nextauth";

// サインアップ時の入力値の検証スキーマを定義
const signUpSchema = z.object({
  email: z.string().email({ message: "メールアドレスの形式ではありません" }),
  password: z.string().min(8, { message: "8文字以上入力する必要があります" }),
  rePassword: z.string(),
}).refine((data) => data.password === data.rePassword, {
  message: "パスワードが一致しません",
  path: ["rePassword"],
});

// サインアップ入力の型を定義
type SignUpInput = z.infer<typeof signUpSchema>;

// 仮登録処理
export const temporarySignup = async (input: SignUpInput) => {
  try {
    // 入力値のバリデーション
    const validatedData = signUpSchema.parse(input);

    // APIリクエスト用のボディを作成
    const body = JSON.stringify({
      email: validatedData.email,
      password: validatedData.password,
      re_password: validatedData.rePassword,
    });

    console.log('Sending signup request with data:', body);

    // APIにPOSTリクエストを送信
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const responseData = await apiRes.json();
    console.log('Server response:', responseData);

    if (!apiRes.ok) {
      console.error('Signup error:', responseData);
      return {
        success: false,
        error: JSON.stringify(responseData) || "サインアップに失敗しました",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Signup error:', error);  // エラー内容をログに出力
    if (error instanceof z.ZodError) {
      // Zodのバリデーションエラーの場合
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    return {
      success: false,
      error: "サインアップ中にエラーが発生しました",
    };
  }
};

// アクティベーションメールの再送信処理
export const resendActivationEmail = async (email: string) => {
  try {
    // APIにPOSTリクエストを送信
    const apiRes = await fetch(`${process.env.API_URL}/api/auth/users/resend_activation/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!apiRes.ok) {
      const errorData = await apiRes.json();
      return {
        success: false,
        error: errorData.detail || "メールの再送信に失敗しました",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "メールの再送信中にエラーが発生しました",
    };
  }
};

// アカウント本登録
export const completeSignup = async ({ uid, token }: { uid: string; token: string }) => {
  try {
    console.log('Sending activation request with data:', { uid, token });
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users/activation/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, token }),
    });

    console.log('Activation response status:', apiRes.status);
    const responseText = await apiRes.text();
    console.log('Activation response text:', responseText);

    // 204 No Content は成功として扱う
    if (apiRes.status === 204) {
      console.log('Activation successful (204 No Content)');
      return { success: true };
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      // 空のレスポンスの場合、成功とみなす
      if (responseText.trim() === '') {
        return { success: true };
      }
      return {
        success: false,
        error: "サーバーからの応答を解析できませんでした",
      };
    }

    if (!apiRes.ok) {
      console.error('Activation error:', data);
      // ユーザーが既にアクティブな場合は成功とみなす
      if (data.detail && (
        data.detail.toLowerCase().includes("already activated") ||
        data.detail.toLowerCase().includes("stale token")
      )) {
        return { success: true, alreadyActivated: true };
      }
      return {
        success: false,
        error: data.detail || "アカウントの有効化に失敗しました",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Activation error:', error);
    return {
      success: false,
      error: "アカウントの有効化中にエラーが発生しました",
    };
  }
};

// ログアウト処理
// サーバーサイドでのセッション無効化
export const invalidateSession = async () => {
  try {
    const session = await getServerSession(authOptions)
    if (session) {
      // セッションを無効化する処理をここに実装
      // 例: データベースからセッションを削除する、など
      console.log("User logged out:", session.user.email)
    }
    return { success: true }
  } catch (error) {
    console.error('Session invalidation error:', error)
    return {
      success: false,
      error: "セッションの無効化中にエラーが発生しました",
    }
  }
}