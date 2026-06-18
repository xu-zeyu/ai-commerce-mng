import { z } from "zod";

export const phoneRegex = /^1[3-9]\d{9}$/;

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "请输入用户名"),
  code: z
    .string()
    .min(4, "验证码至少4位")
    .max(6, "验证码最多6位"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
