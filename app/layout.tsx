import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Script from "next/script";
import { createSupabaseServer } from "@/lib/supabase/server";
import InitialLoader from "@/components/InitialLoader";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FYTRR Run 2026",
  description: "Register for the ultimate Hyrox event in Dumka",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch user on the SERVER
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="antialiased">
        {/* 2. Pass the user as a prop to the Navbar to prevent "Loading..." lag */}
        <InitialLoader />
        <Navbar initialUser={user} />

        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />

        <PageTransition>
          <main className="relative">{children}</main>
        </PageTransition>

        <Footer />
      </body>
    </html>
  );
}
