import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "GYMOS Admin | Management Portal",
  description: "Elite gym management dashboard for GYMOS.",
};

import AdminLayout from "@/components/layout/AdminLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased bg-black text-white`}>
        <AdminLayout>
          {children}
        </AdminLayout>
      </body>
    </html>
  );
}
