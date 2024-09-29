'use client'

import React, {useState} from 'react'
import styles from "./style.module.scss";
import {Button, Link, Checkbox, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import { temporarySignup, resendActivationEmail } from "@/actions/user"
import RulesModal from "@/components/RulesModal/index";
import { z } from "zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from 'react-hot-toast'

// フォームの入力値の検証スキーマを定義
const schema = z.object({
    email: z.string().email({ message: "メールアドレスの形式ではありません" }),
    password: z.string().min(8, { message: "8文字以上入力する必要があります" }),
    rePassword: z.string(),
}).refine((data) => data.password === data.rePassword, {
    message: "パスワードが一致しません",
    path: ["rePassword"],
});

// 入力値の型を定義
type InputType = z.infer<typeof schema>

const SignUpForm = () => {
    // 状態管理のためのフック
    const [isLoading, setIsLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [isRulesModalOpen, setIsRulesModalOpen] = useState(false)
    const [isAgreed, setIsAgreed] = useState(false)
    const router = useRouter()

    // react-hook-formの設定
    const { register, handleSubmit, formState: { errors } } = useForm<InputType>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            rePassword: "",
        },
    })

    // フォーム送信時の処理
    const onSubmit: SubmitHandler<InputType> = async (data) => {
        if (!isAgreed) {
            toast.error("利用規約に同意してください")
            return
        }

        setIsLoading(true)

        try {
            const res = await temporarySignup(data)

            if (!res.success) {
                console.error(res);  // エラーレスポンスの詳細を出力
                toast.error(res.error || "サインアップに失敗しました")
                return
            }

            setIsSignUp(true)
        } catch (error) {
            console.error("サインアップエラー:", error);  // キャッチしたエラーを出力
            toast.error("サインアップに失敗しました")
        } finally {
            setIsLoading(false)
        }
    }

    // アクティベーションメールの再送信処理
    const handleResendEmail = async () => {
        const email = (document.getElementById('email') as HTMLInputElement).value
        const res = await resendActivationEmail(email)
        if (res.success) {
            toast.success("本登録メールを再送しました")
        } else {
            toast.error(res.error || "メールの再送信に失敗しました")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.signupForm}>
            <div className={styles.signupForm}>
                <div className={styles.title}>
                    Sign Up
                </div>
                <Input
                    {...register("email")}
                    variant="underlined"
                    type="email"
                    label="Email"
                    className={styles.signupInput}
                    placeholder="Enter your email"
                    classNames={{
                        inputWrapper: styles.customInputWrapper,
                        label: styles.customLabel,
                        input: styles.customInput
                    }}
                    errorMessage={errors.email?.message}
                />
                <Input
                    {...register("password")}
                    variant="underlined"
                    type="password"
                    label="Password"
                    className={styles.signupInput}
                    placeholder="Enter your password"
                    classNames={{
                        inputWrapper: styles.customInputWrapper,
                        label: styles.customLabel,
                        input: styles.customInput
                    }}
                    errorMessage={errors.password?.message}
                />
                <Input
                    {...register("rePassword")}
                    variant="underlined"
                    type="password"
                    label="Confirm Password"
                    className={styles.signupInput}
                    placeholder="Confirm your password"
                    classNames={{
                        inputWrapper: styles.customInputWrapper,
                        label: styles.customLabel,
                        input: styles.customInput
                    }}
                    errorMessage={errors.rePassword?.message}
                />
                <div className={styles.rule}>
                    <Checkbox
                        isSelected={isAgreed}
                        onValueChange={setIsAgreed}
                        radius="sm"
                    />
                    <Link className={styles.check} onPress={() => setIsRulesModalOpen(true)}>
                        利用規約及びプライバシーポリシーに同意する
                    </Link>
                </div>
                <Button type="submit" radius={"md"} className={styles.button} isLoading={isLoading}>
                    Send Mail
                </Button>

                <Link isBlock showAnchorIcon href="/login" color="foreground" className={styles.link}
                      underline="always">
                    アカウントを既にお持ちの方はこちら
                </Link>

                <RulesModal
                    isOpen={isRulesModalOpen}
                    onOpenChange={setIsRulesModalOpen}
                />

                {/* サインアップ完了モーダル */}
                <Modal isOpen={isSignUp} onClose={() => setIsSignUp(false)} placement={"center"}>
                    <ModalContent>
                        <ModalHeader>メールを送信いたしました</ModalHeader>
                        <ModalBody>
                            <p>アカウント本登録に必要なメールを送信しました。</p>
                            <p>メールのURLより本登録画面へ進んでいただき、本登録を完了させてください。</p>
                            <p>※メールが届かない場合、以下の再送ボタンから試みてください。</p>
                            <p>※それでも届かない場合は入力したメールアドレスが間違っている可能性があります。お手数ですが、再度、新規登録からやり直してください。</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={handleResendEmail}>
                                本登録メールを再送する
                            </Button>
                            <Button color="secondary" onPress={() => router.push('/login')}>
                                ログイン画面に戻る
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </form>
    )
}

export default SignUpForm