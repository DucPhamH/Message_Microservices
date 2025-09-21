"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export default function NotFoundPage() {
  const t = useTranslations("NotFound");
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center h-screen overflow-hidden",
        "bg-gradient-to-br from-indigo-50 via-white to-indigo-100",
        "dark:bg-none"
      )}
    >
      {/* Floating Ghost Icon */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mb-6"
      >
        <Ghost className="w-24 h-24 text-indigo-500 drop-shadow-lg" />
      </motion.div>

      {/* Big 404 */}
      <motion.h1
        className="text-9xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500 drop-shadow-xl"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="mt-4 text-xl text-gray-600 dark:text-inherit"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {t("message")} 🫥
      </motion.p>

      {/* Button */}
      <motion.div
        className="mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link href="/auth">
          <Button
            size="lg"
            className="rounded-full px-8 py-6 shadow-xl hover:scale-105 transition"
          >
            {t("go_back")}
          </Button>
        </Link>
      </motion.div>

      {/* Background Floating Circles */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-indigo-300/40 rounded-full blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 bg-pink-300/40 rounded-full blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
    </div>
  );
}
