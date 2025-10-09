"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserRound,
  Github,
  Facebook,
  MessageSquareText,
  Sparkles,
  CheckCircle2,
  XCircle,
  Triangle,
} from "lucide-react";
import { ThemeToggleSwitch } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const locale = useLocale();

  const t = useTranslations("Auth");

  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [pwd, setPwd] = useState("");
  const [email, setEmail] = useState("");

  const emailOk = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );
  const strength = useMemo(() => {
    let s = 0;
    if (pwd.length >= 8) s += 25;
    if (/[A-Z]/.test(pwd)) s += 25;
    if (/[0-9]/.test(pwd)) s += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) s += 25;
    return s;
  }, [pwd]);

  const onLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  const onRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div
      className={cn(
        "relative min-h-screen w-full overflow-hidden",
        "bg-[radial-gradient(1200px_600px_at_-10%_-10%,hsl(221_83%_53%/.18),transparent_60%),radial-gradient(1000px_500px_at_110%_10%,hsl(199_89%_48%/.14),transparent_60%),linear-gradient(to_bottom_right,hsl(210_40%_98%),hsl(210_40%_96%))]",
        "dark:bg-none"
      )}
    >
      {/* Aurora ribbons */}
      <div className="pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black,transparent_65%)]">
        <motion.div
          initial={{ x: -200 }}
          animate={{ x: 200 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 14 }}
          className="absolute -top-24 left-[-20%] h-[40rem] w-[60rem] rotate-[12deg] bg-[conic-gradient(from_120deg_at_50%_50%,#60a5fa_0deg,#22d3ee_120deg,#a78bfa_240deg,#60a5fa_360deg)] blur-[60px]"
        />
      </div>
      {/* Subtle grid & noise */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <CursorSpotlight />

      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 dark:bg-black shadow">
            <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/5" />
            <MessageSquareText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-semibold tracking-tight text-slate-900 dark:text-inherit">
              NovaChat
            </p>
            <p className="text-xs text-slate-500 dark:text-inherit">
              Realtime chat for teams
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 dark:text-inherit">
          <DropdownMenu>
            <DropdownMenuTrigger>
              {locale.toLocaleUpperCase()}
              <Triangle
                className="ml-1 inline h-3 w-3 stroke-[3px] rotate-180"
                fill="currentColor"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href="/auth" locale="vi" replace>
                <DropdownMenuItem>
                  Tiếng Việt<DropdownMenuShortcut>VI</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>

              <Link href="/auth" locale="en" replace>
                <DropdownMenuItem>
                  English<DropdownMenuShortcut>EN</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          <div
            className={cn(
              "group inline-flex items-center gap-1 rounded-full border border-transparent px-3 py-1 font-medium shadow-sm backdrop-blur transition",
              "hover:border-slate-300 hover:bg-white/80 text-slate-700 bg-white/60",
              "dark:border-border dark:text-inherit dark:bg-card"
            )}
          >
            <ThemeToggleSwitch />
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-2 md:grid-cols-2">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="order-2 md:order-1"
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 dark:bg-card/70 dark:border-border/70 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-medium">Online now</p>
            </div>

            <h1 className="mb-2 text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl dark:text-inherit">
              Chat nhanh, bảo mật,
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {" "}
                mượt mà
              </span>
            </h1>
            <p className="mb-6 text-slate-600 dark:text-inherit">
              Kết nối nhóm của bạn với tin nhắn realtime, gọi thoại/video và
              chia sẻ tệp. Đăng nhập để bắt đầu trò chuyện ngay!
            </p>
            <ul className="grid gap-3 text-sm text-slate-700 dark:text-inherit md:grid-cols-2">
              <li className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" /> Đồng bộ đa thiết
                bị
              </li>
              <li className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" /> Mã hóa đầu–cuối
              </li>
              <li className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-600" /> Nhắc việc & bot
              </li>
              <li className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-600" /> Chủ đề & emoji
                pack
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Right: Auth Card with animated border */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="order-1 md:order-2"
        >
          <div className="relative">
            <div className="pointer-events-none absolute -inset-px rounded-[26px] bg-[conic-gradient(from_0deg,rgba(59,130,246,.6),rgba(14,165,233,.6),rgba(99,102,241,.6),rgba(59,130,246,.6))] p-[1.5px] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]" />
            <Card className="relative overflow-hidden rounded-3xl border-slate-200/70 bg-white/80 dark:bg-card/80 dark:border-border/70 shadow-2xl backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-x-0 -top-1 h-1 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl">Chào mừng trở lại</CardTitle>
                <CardDescription>
                  Đăng nhập hoặc tạo tài khoản mới
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">{t("sign_in")}</TabsTrigger>
                    <TabsTrigger id="register-tab" value="register">
                      {t("sign_up")}
                    </TabsTrigger>
                  </TabsList>

                  {/* LOGIN */}
                  <TabsContent value="login" className="mt-6">
                    <form onSubmit={onLogin} className="grid gap-5">
                      <div className="grid gap-2">
                        <Label
                          htmlFor="login-email"
                          className="text-slate-700 dark:text-inherit"
                        >
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-inherit" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-9 pr-9"
                            required
                            onChange={(e) => setEmail(e.currentTarget.value)}
                          />
                          {email.length > 0 &&
                            (emailOk ? (
                              <CheckCircle2 className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                            ) : (
                              <XCircle className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-500" />
                            ))}
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label
                          htmlFor="login-password"
                          className="text-slate-700 dark:text-inherit"
                        >
                          Mật khẩu
                        </Label>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-inherit" />
                          <Input
                            id="login-password"
                            type={showPasswordLogin ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-9 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswordLogin((s) => !s)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-500 dark:text-inherit"
                            aria-label={
                              showPasswordLogin
                                ? "Ẩn mật khẩu"
                                : "Hiện mật khẩu"
                            }
                          >
                            {showPasswordLogin ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox id="remember" />
                          <Label
                            htmlFor="remember"
                            className="text-slate-600 dark:text-inherit"
                          >
                            Ghi nhớ
                          </Label>
                        </div>
                        <a
                          href="#"
                          className="text-sm text-blue-600 dark:text-inherit dark:hover:text-blue-600 hover:underline"
                        >
                          Quên mật khẩu?
                        </a>
                      </div>

                      <Button
                        type="submit"
                        className="group h-11 w-full rounded-xl text-base"
                      >
                        <span className="mr-1">Đăng nhập</span>
                        <motion.span
                          className="inline-block"
                          initial={{ x: 0 }}
                          whileHover={{ x: 2 }}
                        >
                          →
                        </motion.span>
                      </Button>

                      <div className="grid gap-4">
                        <div className="relative">
                          {/* <Separator className="bg-slate-200" /> */}
                          <span className="absolute inset-0 -top-3 mx-auto w-max  px-3 text-xs text-slate-500 dark:text-inherit">
                            hoặc đăng nhập với
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-10 rounded-xl"
                          >
                            <Github className="mr-2 h-4 w-4" /> Github
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-10 rounded-xl"
                          >
                            <Facebook className="mr-2 h-4 w-4" /> Facebook
                          </Button>
                        </div>
                      </div>
                    </form>
                  </TabsContent>

                  {/* REGISTER */}
                  <TabsContent value="register" className="mt-6">
                    <form onSubmit={onRegister} className="grid gap-5">
                      <div className="grid gap-2">
                        <Label
                          htmlFor="name"
                          className="text-slate-700 dark:text-inherit"
                        >
                          Tên hiển thị
                        </Label>
                        <div className="relative">
                          <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-inherit" />
                          <Input
                            id="name"
                            placeholder="Nguyễn Văn A"
                            className="pl-9"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label
                          htmlFor="email"
                          className="text-slate-700 dark:text-inherit"
                        >
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-inherit" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-9"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label
                          htmlFor="password"
                          className="text-slate-700 dark:text-inherit"
                        >
                          Mật khẩu
                        </Label>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-inherit" />
                          <Input
                            id="password"
                            type={showPasswordRegister ? "text" : "password"}
                            placeholder="Tối thiểu 8 ký tự"
                            className="pl-9 pr-10"
                            required
                            onChange={(e) => setPwd(e.currentTarget.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswordRegister((s) => !s)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-500 dark:text-inherit"
                            aria-label={
                              showPasswordRegister
                                ? "Ẩn mật khẩu"
                                : "Hiện mật khẩu"
                            }
                          >
                            {showPasswordRegister ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <div className="mt-2 grid gap-1">
                          <Progress value={strength} className="h-1.5" />
                          <p className="text-[11px] text-slate-500 dark:text-inherit">
                            Độ mạnh mật khẩu:{" "}
                            {strength < 50
                              ? "Yếu"
                              : strength < 75
                              ? "Khá"
                              : "Mạnh"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox id="terms" required />
                        <Label
                          htmlFor="terms"
                          className="text-slate-600 dark:text-inherit"
                        >
                          Tôi đồng ý với{" "}
                          <a
                            className="text-blue-600 dark:text-inherit dark:hover:text-blue-600 hover:underline"
                            href="#"
                          >
                            Điều khoản
                          </a>
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="group h-11 w-full rounded-xl text-base"
                      >
                        <span className="mr-1">Tạo tài khoản</span>
                        <motion.span
                          className="inline-block"
                          initial={{ x: 0 }}
                          whileHover={{ x: 2 }}
                        >
                          →
                        </motion.span>
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function CursorSpotlight() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(220px 220px at ${pos.x}px ${pos.y}px, rgba(59,130,246,.16), transparent 60%)`,
      }}
    />
  );
}
