// import type { Metadata, Viewport } from "next";
// import "./globals.css";
// import { ThemeProviderWrapper } from "@/components/ThemeProviderWrapper";

// export const metadata: Metadata = {
//   title: "Digital Wallet for Green Travel",
//   description: "DWGT aims to help tourists make their trips more sustainable.",
//   generator: "Next.js",
//   manifest: "/manifest.json",
//   keywords: ["nextjs", "next14", "pwa", "next-pwa"],
//   icons: [
//     { rel: "apple-touch-icon", url: "icon-192x192.png" },
//     { rel: "icon", url: "icon-192x192.png" },
//   ],
// };

// // ✅ Must now be exported separately
// export const themeColor = [
//   { media: "(prefers-color-scheme: light)", color: "#ffffff" },
//   { media: "(prefers-color-scheme: dark)", color: "#0f1f1b" },
// ];

// export const viewport: Viewport = {
//   width: "device-width",
//   initialScale: 1,
//   viewportFit: "cover",
// };

// export default function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
//       </body>
//     </html>
//   );
// }

// app/layout.tsx
import "./globals.css";
import { ThemeProviderWrapper } from "@/components/ThemeProviderWrapper";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Digital Wallet for Green Travel",
  description: "DWGT helps tourists make sustainable trips.",
  generator: "Next.js",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
      </body>
    </html>
  );
}
