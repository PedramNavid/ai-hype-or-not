import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hypeflo.ws'
const ogImageUrl = `${siteUrl}/og-image.png`

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'LLM Workflows - Community-Driven AI Development Workflows',
        template: '%s | LLM Workflows'
    },
    description: "Discover battle-tested AI and LLM workflows from developers using AI to ship faster. Real experiences, not theory.",
    keywords: ['AI workflows', 'LLM development', 'AI coding', 'developer workflows', 'Claude workflows', 'GPT workflows', 'AI development'],
    authors: [{ name: 'LLM Workflows Community' }],
    creator: 'LLM Workflows',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteUrl,
        siteName: 'LLM Workflows',
        title: 'LLM Workflows - Community-Driven AI Development Workflows',
        description: "Discover battle-tested AI and LLM workflows from developers using AI to ship faster. Real experiences, not theory.",
        images: [
            {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: 'LLM Workflows - Community-Driven AI Development',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'LLM Workflows - Community-Driven AI Development Workflows',
        description: "Battle-tested AI and LLM workflows from developers using AI to ship faster.",
        images: [ogImageUrl],
        creator: '@llmworkflows',
    },
    alternates: {
        canonical: '/',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
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
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
