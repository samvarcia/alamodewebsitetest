import localFont from "next/font/local";
// import { Inter } from "next/font/google";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "à la mode",
  description: "Location à la mode is a model exclusive event series created to foster a sense of community within the often isolating modeling industry",
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
      <head>
	      <link rel="icon" href="/icon.ico" type="imag/x-icon" sizes="16x16"/>
       </head>
      <body className={futura.className}>{children}</body>
    </html>
  );
}
