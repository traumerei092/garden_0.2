import React, { useState, useEffect } from 'react'
import styles from "./style.module.scss";
import {Button, Input, Link} from "@nextui-org/react";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";

const LoginForm = () => {
    const router = useRouter(); // useRouterを使用
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [apiUrl, setApiUrl] = useState<string | null>(null)

    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_API_URL;
        console.log('API URL:', url); // デバッグログを追加
        if (url) {
            setApiUrl(url);
        } else {
            console.error('API URLが設定されていません');
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!apiUrl) {
            setError('API URLが設定されていません');
            setIsLoading(false);
            return;
        }

        try {
            // NextAuthを使って認証
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                console.log(result.error); // 認証エラーがあった場合
                setError('ログインに失敗しました');
            }

            // ログインに成功した場合、ホームページにリダイレクト
            router.push('/');

        } catch (error) {
            console.error('Login error:', error);
            setError('ログイン中にエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.loginForm}>
                <div className={styles.title}>
                    Log In
                </div>
                <Input
                    variant="underlined"
                    type="email"
                    label="Email"
                    className={styles.loginInput}
                    placeholder="Enter your email"
                    classNames={{
                        inputWrapper: styles.customInputWrapper,
                        label: styles.customLabel,
                        input: styles.customInput
                    }}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    variant="underlined"
                    type="password"
                    label="Password"
                    className={styles.loginInput}
                    placeholder="Enter your password"
                    classNames={{
                        inputWrapper: styles.customInputWrapper,
                        label: styles.customLabel,
                        input: styles.customInput
                    }}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className={styles.errorMessage}>{error}</p>}
                <Button type="submit" radius={"md"} className={styles.button} disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Log In'}
                </Button>
                <Link isBlock showAnchorIcon href="/signup" color="foreground" className={styles.link}
                      underline="always">
                    アカウントをお持ちでない方はこちら
                </Link>
            </div>
        </form>
    )
}

export default LoginForm