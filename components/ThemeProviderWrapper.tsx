// this was previously together in layout.tsx but it is not possible to mix metadata export (server side) with "use client" (client side)
// therefore the file had to be split in two
"use client";

import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  GlobalStyles,
} from "@mui/material";
import { lightTheme, darkTheme } from "@/lib/theme";
import {
  ThemeProvider as CustomThemeProvider,
  useThemeContext,
} from "@/context/ThemeContext";
import { usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeContext();
  const theme = mode === "dark" ? darkTheme : lightTheme;
  const pathname = usePathname();

  // 👇 Customize routes where you want BottomNav visible
  const showBottomNav =
    pathname?.startsWith("/profile") ||
    pathname?.startsWith("/learn") ||
    pathname?.startsWith("/explore") ||
    pathname?.startsWith("/market") ||
    pathname?.startsWith("/trips");

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            backgroundImage: `url(/${mode}-bg.svg)`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
          },
        }}
      />
      {children}
      {showBottomNav && <BottomNav />}
    </MuiThemeProvider>
  );
}

export const ThemeProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <CustomThemeProvider>
      <InnerLayout>{children}</InnerLayout>
    </CustomThemeProvider>
  );
};
