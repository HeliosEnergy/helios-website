import type { Metadata } from "next";
import { Funnel_Display, Darker_Grotesque, Playfair_Display } from "next/font/google";
import "./globals.css";
import LayoutTransition from "./components/ui/LayoutTransition";
import { Analytics } from '@vercel/analytics/next';

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const darkerGrotesque = Darker_Grotesque({
  variable: "--font-darker-grotesque",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Helios - The AI Factory Company",
  description: "Build the future faster with Helios's AI-optimized cloud computing infrastructure.",
  icons: {
    icon: '/logo-white.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${funnelDisplay.variable} ${darkerGrotesque.variable} ${playfairDisplay.variable} font-sans antialiased`}
      >
        <LayoutTransition>
          {children}
        </LayoutTransition>
        <Analytics />
      </body>
    </html>
  );
}