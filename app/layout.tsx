import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import TabBar from "./components/TabBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QKart - Online Supermarket Shopping",
  description: "Shop fresh groceries, daily essentials, and premium products online. Fast delivery and great prices.",
  keywords: ["QKart", "online supermarket", "grocery shopping", "fresh produce", "daily essentials", "sana", "chipiku", "tutlas", "shopwise", "food delivery", "supermarket online"],
  authors: [{ name: "QKart Team" }],
  openGraph: {
    title: "QKart - Online Supermarket Shopping",
    description: "Shop fresh groceries, daily essentials, and premium products online. Fast delivery and great prices.",
    type: "website",
  },
};

function Body({ children }: { children: React.ReactNode }) {
  return (
    <body className="min-h-full overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.14),_transparent_18%),radial-gradient(circle_at_top_right,_rgba(165,180,252,0.16),_transparent_16%),radial-gradient(circle_at_70%_80%,_rgba(252,211,77,0.12),_transparent_20%),#0b1728] text-slate-100">
      <CartProvider>
        <Header />
        <main className="flex-1 pt-28">{children}</main>
        <TabBar />
      </CartProvider>
    </body>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <Body>{children}</Body>
    </html>
  );
}
