import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { ProjectProvider } from "@/contexts/project-context";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tasky - Turn my Yak Shave into your Profit",
  description:
    "The all-in-one planning solution to organize your game jam activities.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProjectProvider>
            <Header />
            {children}
          </ProjectProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
