import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Sky Solutions Computer Institute | IT Training in Kanchanpur",
    template: "%s | Sky Solutions",
  },
  description:
    "Professional IT training, computer courses, web development, and IT services in Bedkot, Kanchanpur, Nepal.",
};

export default function WebsiteLayout({ children }) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased`}
    >
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
