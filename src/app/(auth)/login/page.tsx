"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, Smartphone, User as UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/use-auth-store";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/login-schema";
import { getCaptcha } from "@/features/auth/api/get-captcha";
import { smsLogin } from "@/features/auth/api/login";
import { getAdminSelf } from "@/features/auth/api/get-admin-self";
import logo from "@/assets/logo.png";

export default function LoginPage() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaSent, setCaptchaSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", code: "" },
  });

  /** 获取验证码 */
  const handleGetCaptcha = async () => {
    const valid = await trigger("username");
    if (!valid) return;

    setServerError(null);
    setCaptchaLoading(true);
    try {
      await getCaptcha(getValues("username"));
      setCaptchaSent(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "验证码发送失败，请稍后重试";
      setServerError(message);
    } finally {
      setCaptchaLoading(false);
    }
  };

  /** 登录提交 */
  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      // 1. 短信登录获取 token
      const token = await smsLogin({
        username: values.username,
        code: values.code,
      });

      setToken(token);

      // 2. 获取当前用户信息
      const user = await getAdminSelf();
      setUser(user);

      // 3. 跳转首页
      router.push("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "登录失败，请检查用户名和验证码";
      setServerError(message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-lg backdrop-blur-xl supports-[backdrop-filter]:bg-card/50">
        {/* 顶部 Logo 区 */}
        <div className="flex flex-col items-center px-8 pt-10 pb-6">
          <Image
            src={logo}
            alt="金晗跨境"
            width={48}
            height={48}
            className="rounded-xl shadow-sm"
          />
          <h1 className="mt-4 text-xl font-semibold">金晗跨境管理后台</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            使用短信验证码登录
          </p>
        </div>

        {/* 表单区 */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-10 space-y-5">
          {/* 错误提示 */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              >
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 用户名 */}
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                id="username"
                placeholder="请输入管理员用户名"
                className="pl-10"
                disabled={isSubmitting}
                {...register("username")}
              />
            </div>
            {errors.username && (
              <p className="text-xs text-destructive">{errors.username.message}</p>
            )}
          </div>

          {/* 验证码 */}
          <div className="space-y-2">
            <Label htmlFor="code">短信验证码</Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Smartphone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
                <Input
                  id="code"
                  placeholder="请输入验证码"
                  className="pl-10"
                  maxLength={6}
                  disabled={isSubmitting}
                  {...register("code")}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="shrink-0"
                disabled={captchaLoading || isSubmitting}
                onClick={handleGetCaptcha}
              >
                {captchaLoading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    发送中
                  </>
                ) : captchaSent ? (
                  "重新发送"
                ) : (
                  "获取验证码"
                )}
              </Button>
            </div>
            {errors.code && (
              <p className="text-xs text-destructive">{errors.code.message}</p>
            )}
          </div>

          {/* 提交按钮 */}
          <Button type="submit" className="w-full h-11" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                登录中...
              </>
            ) : (
              <>
                登 录
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>
      </div>

      {/* 底部版权 */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} 金晗跨境电商 — 管理后台
      </p>
    </motion.div>
  );
}
