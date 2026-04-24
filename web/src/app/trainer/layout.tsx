import type { Metadata } from "next";
import { DashboardProvider } from "@/lib/context/DashboardContext";

export const metadata: Metadata = {
  title: "GYMOS Trainer | Login",
  description: "Trainer login portal for GYMOS.",
};

export default function TrainerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  );
}
