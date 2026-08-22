'use client'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "./components/queryClientProvider";

import './globals.css'
import { useState } from "react";
import { NavBar } from "@/ui/layout/NavBar/NavBar";
import { Footer } from "@/ui/layout/Footer/Footer";
import { MoodFormGuard } from "./components/MoodFormGuard";
import '@/public/styles/variables.css'

export default function RootLayout({ children }: LayoutProps<"/">) {
   const [open, setOpen] = useState<boolean>(false)

  return (
    <html lang="es">
      <body className="min-full flex flex-col">
        <QueryProvider>
          <div className="w-full">
            <MoodFormGuard>
              <NavBar open={open} setOpen={setOpen} />
              <main className="w-auto max-[600px]:mx-[5%] max-[900px]:ml-[11.5%] mr-[2%] ml-[7%]">
                {children}
              </main>
              <Footer />
            </MoodFormGuard>
          </div>
        </QueryProvider>
      </body>
    </html>)
}


