import type { Metadata } from "next";
import { GeistSans, GeistMono } from 'geist/font';
import "./globals.css";

export const metadata: Metadata = {
  title: "GIGABYTE Presents RunRise Nation Noboborsho Run 1432 - Certificate Collection",
  description: "Retrieve your Certificate easily for the RunRise Nation Noboborsho Run 1432. Simply enter your Certificate number to download your official race Certificate.",
  keywords: [
    "RunRise Nation",
    "Noboborsho Run",
    "Certificate Collection",
    "Race Certificate Download",
    "Marathon Certificate",
    "Bangladesh Running Event",
    "GIGABYTE Run",
    "Sports Event",
    "Running Community"
  ],
  authors: [{ name: "RunRise Nation" }],
  openGraph: {
    title: "GIGABYTE Presents RunRise Nation Noboborsho Run 1432 - Certificate Collection",
    description: "Retrieve your Certificate easily for the RunRise Nation Noboborsho Run 1432. Simply enter your Certificate number to download your official race Certificate.",
    images: ['/nbbrsh.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/nbbrsh.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
