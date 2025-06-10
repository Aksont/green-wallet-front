"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import ExploreIcon from "@mui/icons-material/Explore";
import LuggageIcon from "@mui/icons-material/Luggage";
import PersonIcon from "@mui/icons-material/Person";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useState, useEffect } from "react";

const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [value, setValue] = useState(0);

  useEffect(() => {
    if (pathname?.startsWith("/profile")) setValue(4);
    else if (pathname?.startsWith("/learn")) setValue(0);
    else if (pathname?.startsWith("/explore")) setValue(1);
    else if (pathname?.startsWith("/trips")) setValue(2);
    else if (pathname?.startsWith("/market")) setValue(3);
  }, [pathname]);

  const handleChange = (_: unknown, newValue: number) => {
    setValue(newValue);
    const routes = ["/learn", "/explore", "/trips", "/market", "/profile"];
    router.push(routes[newValue]);
  };

  const tabs = [
    { label: "Learn", icon: <SchoolIcon /> },
    { label: "Explore", icon: <ExploreIcon /> },
    { label: "Trips", icon: <LuggageIcon /> },
    { label: "Market", icon: <StorefrontIcon /> },
    { label: "Profile", icon: <PersonIcon /> },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Paper elevation={3}>
        <BottomNavigation value={value} onChange={handleChange} showLabels>
          {tabs.map((tab) => (
            <BottomNavigationAction
              key={tab.label}
              label={tab.label}
              icon={tab.icon}
              sx={{
                color: "text.secondary",
                "&.Mui-selected": {
                  color: "primary.main",
                  backgroundColor: "action.selected",
                  borderRadius: 2,
                  fontWeight: "bold",
                  ".MuiBottomNavigationAction-label": {
                    fontSize: "0.85rem",
                  },
                  ".MuiSvgIcon-root": {
                    fontSize: 28,
                  },
                },
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default BottomNav;
