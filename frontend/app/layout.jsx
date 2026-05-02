import "./globals.css";

export const metadata = {
  title: "CafeWeb",
  description: "Кафены захиалгын веб",
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
