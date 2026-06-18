"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, Lock, ShieldCheck, User as UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/use-auth-store";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/login-schema";
import { getCaptcha } from "@/features/auth/api/get-captcha";
import { login } from "@/features/auth/api/login";
import { getAdminSelf } from "@/features/auth/api/get-admin-self";
import logo from "@/assets/logo.png";

export default function LoginPage() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const [serverError, setServerError] = useState<string | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "", smsCode: "" },
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCountdown = useCallback(() => {
    setCountdown(60);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleGetCaptcha = async () => {
    const valid = await trigger("username");
    if (!valid) return;

    setServerError(null);
    setCaptchaLoading(true);
    try {
      await getCaptcha(getValues("username"));
      startCountdown();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "验证码发送失败，请稍后重试";
      setServerError(message);
    } finally {
      setCaptchaLoading(false);
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const token = await login({
        username: values.username,
        password: values.password,
        smsCode: values.smsCode,
      });

      setToken(token);

      const user = await getAdminSelf();
      setUser(user);

      router.push("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "登录失败，请检查用户名和密码";
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
            请输入账号密码登录
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

          {/* 密码 */}
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                className="pl-10"
                disabled={isSubmitting}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* 短信验证码 */}
          <div className="space-y-2">
            <Label htmlFor="smsCode">短信验证码</Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <ShieldCheck className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
                <Input
                  id="smsCode"
                  placeholder="请输入验证码"
                  className="pl-10"
                  maxLength={6}
                  disabled={isSubmitting}
                  {...register("smsCode")}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="shrink-0"
                disabled={captchaLoading || countdown > 0 || isSubmitting}
                onClick={handleGetCaptcha}
              >
                {captchaLoading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : countdown > 0 ? (
                  `${countdown}s`
                ) : (
                  "获取验证码"
                )}
              </Button>
            </div>
            {errors.smsCode && (
              <p className="text-xs text-destructive">{errors.smsCode.message}</p>
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
