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
  metadataBase: new URL('https://helios-landing-page.vercel.app'), // TODO: Replace with actual production domain
  title: "Helios - The AI Factory Company",
  description: "Build the future faster with Helios's AI-optimized cloud computing infrastructure.",
  icons: {
    icon: '/logo-white.svg',
  },
  openGraph: {
    title: "Helios - The AI Factory Company",
    description: "Build the future faster with Helios's AI-optimized cloud computing infrastructure.",
    images: [
      {
        url: '/logo-black-1024x_refined(1)_light_lower_white.png',
        width: 1024,
        height: 1024,
        alt: 'Helios Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Helios - The AI Factory Company",
    description: "Build the future faster with Helios's AI-optimized cloud computing infrastructure.",
    images: ['/logo-black-1024x_refined(1)_light_lower_white.png'],
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