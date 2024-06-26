import localFont from "next/font/local";
// import { Inter } from "next/font/google";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "A LA MODE",
  // description: "Generated by create next app",
};
const futura = localFont({
  src: [
    {
      path: "./futuralight.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./futuraregular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
});
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={futura.className}>{children}</body>
    </html>
  );
}
