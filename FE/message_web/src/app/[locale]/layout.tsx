// app/layout.tsx
import "../globals.css";
import { fontSans, fontMono } from "../fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Message App",
  description: "Chat application",
};

const locales = ["en", "vi"];

export async function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    redirect(`/${routing.defaultLocale}`);
  }

  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
