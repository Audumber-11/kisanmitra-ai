import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "KisanMitra AI - Voice-First Agricultural Advisor",
  description:
    "Voice-first multilingual agricultural advisory platform for Indian farmers. Get AI-powered guidance in Hindi, Marathi, Telugu.",
  keywords: [
    "agriculture",
    "AI",
    "farming",
    "voice",
    "hindi",
    "marathi",
    "telugu",
    "crop disease",
    "weather alerts",
    "mandi prices",
    "india",
  ],
  authors: [{ name: "KisanMitra Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KisanMitra",
  },
  openGraph: {
    type: "website",
    siteName: "KisanMitra AI",
    title: "KisanMitra AI - Voice-First Agricultural Advisor",
    description:
      "AI-powered agricultural guidance for Indian farmers in their native language",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2E7D32",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
