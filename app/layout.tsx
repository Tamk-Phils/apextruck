import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/supabase/context";
import ConditionalLayout from "@/components/ConditionalLayout";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://apextruckparts.com"), // Placeholder URL
  title: {
    default: "Apex Truck Parts & Beds — Premium Hardware & Custom Flatbeds",
    template: "%s | Apex Truck Parts & Beds",
  },
  description:
    "Reliable, rugged, and high-performance truck parts. From custom beds to heavy-duty hardware, Apex provides the best for your fleet.",
  keywords: ["truck parts", "custom beds", "flatbeds", "heavy duty", "hardware", "truck accessories", "industrial components"],
  authors: [{ name: "Apex Team" }],
  creator: "Apex Industrial",
  publisher: "Apex Truck Parts & Beds",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://apextruckparts.com",
    siteName: "Apex Truck Parts & Beds",
    title: "Apex Truck Parts & Beds — Premium Hardware & Custom Flatbeds",
    description: "Reliable, rugged, and high-performance truck parts. From custom beds to heavy-duty hardware.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Apex Truck Parts Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex Truck Parts & Beds",
    description: "Reliable, rugged, and high-performance truck parts.",
    creator: "@apex_truckparts",
    images: ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&h=630&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { CartProvider } from "@/lib/cart-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
        <AuthProvider>
          <CartProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
