import type { Metadata } from "next";
import AdminLayout from "@/components/layout/AdminLayout";

export const metadata: Metadata = {
  title: "GYMOS Admin | Management Portal",
  description: "Elite gym management dashboard for GYMOS.",
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
