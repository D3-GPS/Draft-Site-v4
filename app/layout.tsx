import type { ReactNode } from "react";

export const metadata = {
  title: "D3 Landing Page V4",
  description: "Deploy-ready review build for D3 landing page V4.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
