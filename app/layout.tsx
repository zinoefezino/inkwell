import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const siteUrl = "https://inkwell-five-azure.vercel.app";
const title = "Inkwell — Tailored proposals and CVs in seconds";
const description =
  "Paste a job posting and Inkwell reorders and reframes your real experience into a tailored proposal and CV — for freelancers and job seekers.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Inkwell",
  },
  description,
  keywords: [
    "job application tool",
    "cv tailoring",
    "resume tailoring",
    "freelance proposal generator",
    "AI cover letter",
    "tailored resume",
  ],
  authors: [{ name: "Zino" }],
  creator: "Zino",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo2.png",
    apple: "/logo2.png",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    siteName: "Inkwell",
    images: [
      {
        url: "/logo2.png",
        width: 512,
        height: 512,
        alt: "Inkwell",
      },
    ],
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: ["/logo2.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#14171F" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html
        lang="en"
        className={`${bricolage.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <head>
          {/* Applies the saved theme (light/dark/system) before React
              hydrates, so there's no flash of the wrong theme on load. */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var stored = localStorage.getItem('inkwell-theme') || 'system';
                    var isDark = stored === 'dark' || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                    if (isDark) document.documentElement.classList.add('dark');
                  } catch (e) {}
                })();
              `,
            }}
          />
        </head>
        <body suppressHydrationWarning className="min-h-full flex flex-col">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
