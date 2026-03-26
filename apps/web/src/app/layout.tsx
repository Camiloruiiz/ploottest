import type { Metadata } from "next";
import { AuthHashHandler } from "@/components/providers/auth-hash-handler";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlootTest",
  description: "Boilerplate base for the PlootTest e-commerce MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthHashHandler />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
