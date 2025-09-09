import "./globals.css";
import { fontSans, fontMono } from "./fonts";

export const metadata = {
  title: "Message App",
  description: "Chat application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${fontSans.variable} ${fontMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
