import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";

export const metadata: Metadata = {
  title: "ClinicScribe | AI-Powered Clinical Documentation SaaS",
  description: "Turning Conversations into Care. Transform multilingual doctor-patient consultations into structured, doctor-reviewed clinical documentation with Google Gemini AI.",
  keywords: ["Healthcare SaaS", "Clinical Scribe", "Medical AI", "Doctor Documentation", "Gemini AI", "Clinical Notes"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-brand-seafoam selection:text-brand-evergreen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
