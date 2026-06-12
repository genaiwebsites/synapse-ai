import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Space_Grotesk, Space_Mono, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Synapse | Enterprise Agentic Vault",
  description: "Your company's private intelligence vault. Zero-scrape grounding, multimodal reasoning, and absolute business memory seamlessly blended.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${inter.variable} ${jetbrainsMono.variable} scroll-smooth h-full antialiased`}
    >
      <body className="min-h-full flex flex-col selection:bg-indigo-500/30 selection:text-indigo-100 relative">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
