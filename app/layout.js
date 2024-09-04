import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";

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
  variable: '--font-futura',
  display: 'swap', // Add this line
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <head>
        <link rel="icon" href="/icon.ico" type="image/x-icon" sizes="16x16"/>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-M6QPB74M4M"/>
        <Script id="google-analytics"> 
          {`
            window.dataLayer = window.dataLayer || []
            function gtag(){dataLayer.push(arguments)}
            gtag('js', new Date());
  
            gtag('config', 'G-M6QPB74M4M');
          `}
        </Script>
      </head>
      <body className={futura.className}>{children}</body>
    </html>
  );
}