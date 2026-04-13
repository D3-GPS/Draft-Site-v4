export const metadata = {
  title: "D3 Landing Page V4",
  description: "Deploy-ready review build for the D3 landing page V4.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
