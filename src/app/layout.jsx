import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";


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
    "Sky Solutions Computer Institute - Professional IT training, computer courses, web development, networking, and IT services in Bedkot, Kanchanpur, Nepal.",
  keywords: [
    "IT training",
    "computer institute",
    "Kanchanpur",
    "web development",
    "nepal",
  ],
  openGraph: {
    title: "Sky Solutions Computer Institute",
    description:
      "Professional IT training and computer courses in Kanchanpur, Nepal.",
    url: "https://skysolutionsnp.com",
    siteName: "Sky Solutions",
    locale: "en_US",
    type: "website",
  },
};

export default  function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
       
        {children}
                <ToastContainer position="top-right" theme="dark" autoClose={3000} />
     
        </body>
    </html>
  );
}
