import type { Metadata } from "next";
import { Noto_Serif, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  weight: ["400", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Joyita Linda | Joyería Fina en Plata",
  description: "Diseños exquisitos de joyería en plata .925 con estética moderna. Hecho a mano en México con precisión y alma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${notoSerif.variable} ${manrope.variable} font-sans antialiased bg-background text-primary selection:bg-primary-container selection:text-white`}>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
