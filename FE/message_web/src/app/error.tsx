"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-50 via-white to-red-100 overflow-hidden">
      {/* Alert Icon */}
      <motion.div
        initial={{ rotate: -15, scale: 0 }}
        animate={{ rotate: [0, -15, 15, 0], scale: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
        className="mb-6"
      >
        <AlertTriangle className="w-24 h-24 text-red-500 drop-shadow-lg" />
      </motion.div>

      {/* Title */}
      <motion.h1
        className="text-7xl font-extrabold text-red-600 drop-shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        Oops!
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="mt-4 text-lg text-gray-700 max-w-md text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Đã có lỗi xảy ra trong hệ thống. Đừng lo, chúng tôi sẽ sớm khắc phục 🚑
      </motion.p>

      {/* Actions */}
      <motion.div
        className="mt-6 flex gap-4"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Button
          variant="destructive"
          onClick={() => reset()}
          className="rounded-full px-6 shadow-md hover:scale-105 transition"
        >
          Thử lại
        </Button>
        <Link href="/">
          <Button className="rounded-full px-6 shadow-md hover:scale-105 transition">
            Trang chủ
          </Button>
        </Link>
      </motion.div>

      {/* Background Glow */}
      <motion.div
        className="absolute top-20 left-20 w-40 h-40 bg-red-300/40 rounded-full blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-16 right-20 w-48 h-48 bg-orange-300/40 rounded-full blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 9, repeat: Infinity }}
      />
    </div>
  );
}
