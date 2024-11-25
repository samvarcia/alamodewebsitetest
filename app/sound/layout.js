export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
	      <link rel="icon" href="/icon.ico" type="imag/x-icon" sizes="16x16"/>
       </head>
      <body >{children}</body>
    </html>
  );
}
