'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {completeSignup, resendActivationEmail} from "@/actions/user"
import {Link} from "@nextui-org/react";
import styles from "./style.module.scss";
import { Button } from "@nextui-org/react";

interface CompleteSignupPageProps {
  params: {
    uid: string
    token: string
  }
}

const CompleteSignupPage = ({ params }: CompleteSignupPageProps) => {
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const router = useRouter();
  const { uid, token } = params;

  useEffect(() => {
    const activateAccount = async () => {
      const res = await completeSignup({ uid, token });
      console.log('Activation result:', res);  // デバッグ用ログ
      setIsCompleted(res.success);
      if (!res.success) {
        setError(res.error || "アカウントの有効化に失敗しました");
      } else if (res.alreadyActivated) {
        setError("このアカウントは既に有効化されています。");
      }
    };

    activateAccount();
  }, [uid, token]);

  const handleResendEmail = async () => {
    if (email) {
      const res = await resendActivationEmail(email);
      if (res.success) {
        alert("アクティベーションメールを再送しました。");
      } else {
        alert(res.error || "メールの再送に失敗しました。");
      }
    } else {
      alert("メールアドレスを入力してください。");
    }
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleSignupClick = () => {
    router.push('/signup');
  };

  if (isCompleted === null) {
    return <div className={styles.guidance}>処理中...</div>;
  }

  if (isCompleted) {
    return (
        <div className={styles.guidance}>
            <h2>本登録完了</h2>
            <p>アカウント本登録が完了しました</p>
            <p>ログインしてください</p>
            <Button
              onClick={handleLoginClick}
              className={styles.button}
            >
              Log In 画面へ
            </Button>
        </div>
    )
  } else {
    return (
        <div className={styles.guidance}>
            <h2>本登録失敗</h2>
            <p>アカウント本登録に失敗しました</p>
            <p>再度アカウント仮登録を行ってください</p>
            <p>{error}</p>
            {error && error.includes("Stale token") && (
                <>
                    <p>トークンの有効期限が切れている可能性があります。新しいアクティベーションメールを送信してください。</p>
                    <input
                        type="email"
                        placeholder="メールアドレスを入力"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button onClick={handleResendEmail}>アクティベーションメールを再送</Button>
                </>
            )}
            <p>または、再度アカウント仮登録を行ってください</p>
            <Button
              onClick={handleSignupClick}
              className={styles.button}
            >
              Sign Up 画面へ
            </Button>
        </div>
    )
  }
}

export default CompleteSignupPage